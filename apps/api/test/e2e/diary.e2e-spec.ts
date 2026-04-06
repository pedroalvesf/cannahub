import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestAppHelper } from '../helpers/test-app.helper';
import { AuthHelper } from '../helpers/auth.helper';
import { DatabaseHelper } from '../helpers/database.helper';
import { PrismaService } from '../../src/infra/database/prisma/prisma.service';

describe('Diary E2E', () => {
  let app: INestApplication;
  let authHelper: AuthHelper;
  let databaseHelper: DatabaseHelper;
  let prisma: PrismaService;

  beforeAll(async () => {
    app = await TestAppHelper.createTestApp();
    authHelper = new AuthHelper(app);
    prisma = app.get<PrismaService>(PrismaService);
    databaseHelper = new DatabaseHelper(prisma);
  });

  afterAll(async () => {
    await TestAppHelper.closeApp();
  });

  beforeEach(async () => {
    await databaseHelper.cleanup();
    await databaseHelper.seed();
  });

  // ─────────────────────────────────────────────
  // Auth: all diary endpoints require JWT
  // ─────────────────────────────────────────────
  describe('Auth — all endpoints return 401 without JWT', () => {
    it('POST /diary → 401', async () => {
      await request(app.getHttpServer()).post('/diary').send({}).expect(401);
    });

    it('GET /diary → 401', async () => {
      await request(app.getHttpServer()).get('/diary').expect(401);
    });

    it('GET /diary/:id → 401', async () => {
      await request(app.getHttpServer())
        .get('/diary/00000000-0000-0000-0000-000000000000')
        .expect(401);
    });

    it('PATCH /diary/:id → 401', async () => {
      await request(app.getHttpServer())
        .patch('/diary/00000000-0000-0000-0000-000000000000')
        .send({})
        .expect(401);
    });

    it('DELETE /diary/:id → 401', async () => {
      await request(app.getHttpServer())
        .delete('/diary/00000000-0000-0000-0000-000000000000')
        .expect(401);
    });

    it('POST /diary/favorites → 401', async () => {
      await request(app.getHttpServer())
        .post('/diary/favorites')
        .send({})
        .expect(401);
    });

    it('GET /diary/favorites → 401', async () => {
      await request(app.getHttpServer()).get('/diary/favorites').expect(401);
    });

    it('DELETE /diary/favorites/:id → 401', async () => {
      await request(app.getHttpServer())
        .delete('/diary/favorites/00000000-0000-0000-0000-000000000000')
        .expect(401);
    });

    it('POST /diary/favorites/:id/log → 401', async () => {
      await request(app.getHttpServer())
        .post('/diary/favorites/00000000-0000-0000-0000-000000000000/log')
        .send({})
        .expect(401);
    });

    it('GET /diary/summary → 401', async () => {
      await request(app.getHttpServer()).get('/diary/summary').expect(401);
    });

    it('GET /diary/symptoms/:key/trend → 401', async () => {
      await request(app.getHttpServer())
        .get('/diary/symptoms/pain/trend?dateFrom=2026-01-01&dateTo=2026-12-31')
        .expect(401);
    });
  });

  // ─────────────────────────────────────────────
  // Full CRUD flow
  // ─────────────────────────────────────────────
  describe('Diary entry CRUD flow', () => {
    it('should create, list, get detail, update with severityAfter, and delete', async () => {
      const { accessToken } = await authHelper.createUser({
        email: 'diary-user@example.com',
        password: 'Password123!',
        name: 'Diary User',
      });

      // 1. Create entry with symptoms and effects
      const createRes = await request(app.getHttpServer())
        .post('/diary')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          date: '2026-04-06',
          time: '08:00',
          customProductName: 'CBD Oil 10%',
          administrationMethod: 'oil',
          doseAmount: 5,
          doseUnit: 'drops',
          notes: 'Morning dose',
          symptoms: [
            { symptomKey: 'pain', severityBefore: 'moderate' },
            { symptomKey: 'anxiety', severityBefore: 'mild' },
          ],
          effects: [
            { effectKey: 'relaxed', isPositive: true },
            { effectKey: 'dry_mouth', isPositive: false },
          ],
        })
        .expect(201);

      expect(createRes.body).toHaveProperty('id');
      expect(createRes.body.administrationMethod).toBe('oil');
      expect(createRes.body.doseUnit).toBe('drops');
      const entryId = createRes.body.id;

      // 2. List entries — should contain the created entry
      const listRes = await request(app.getHttpServer())
        .get('/diary')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(listRes.body.total).toBe(1);
      expect(listRes.body.entries).toHaveLength(1);
      const listed = listRes.body.entries[0];
      expect(listed.id).toBe(entryId);
      expect(listed.customProductName).toBe('CBD Oil 10%');
      expect(listed.symptoms).toHaveLength(2);
      expect(listed.effects).toHaveLength(2);
      expect(listed.symptoms[0].severityAfter).toBeNull();

      // 3. Get entry detail
      const detailRes = await request(app.getHttpServer())
        .get(`/diary/${entryId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(detailRes.body.id).toBe(entryId);
      expect(detailRes.body.notes).toBe('Morning dose');
      expect(detailRes.body.symptoms).toHaveLength(2);
      expect(detailRes.body.effects).toHaveLength(2);

      // Grab symptom log IDs for re-evaluation
      const painSymptom = detailRes.body.symptoms.find(
        (s: any) => s.symptomKey === 'pain',
      );
      const anxietySymptom = detailRes.body.symptoms.find(
        (s: any) => s.symptomKey === 'anxiety',
      );
      expect(painSymptom.severityBefore).toBe('moderate');
      expect(painSymptom.severityAfter).toBeNull();

      // 4. Update entry with severityAfter (re-evaluation)
      await request(app.getHttpServer())
        .patch(`/diary/${entryId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          severityAfterUpdates: [
            { symptomLogId: painSymptom.id, severityAfter: 'mild' },
            { symptomLogId: anxietySymptom.id, severityAfter: 'none' },
          ],
        })
        .expect(200);

      // 5. Verify the update — deltas should reflect
      const afterUpdate = await request(app.getHttpServer())
        .get(`/diary/${entryId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const updatedPain = afterUpdate.body.symptoms.find(
        (s: any) => s.symptomKey === 'pain',
      );
      const updatedAnxiety = afterUpdate.body.symptoms.find(
        (s: any) => s.symptomKey === 'anxiety',
      );
      expect(updatedPain.severityBefore).toBe('moderate');
      expect(updatedPain.severityAfter).toBe('mild');
      expect(updatedAnxiety.severityAfter).toBe('none');

      // 6. Delete entry
      await request(app.getHttpServer())
        .delete(`/diary/${entryId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // 7. Verify deleted — listing should be empty
      const afterDelete = await request(app.getHttpServer())
        .get('/diary')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(afterDelete.body.total).toBe(0);
      expect(afterDelete.body.entries).toHaveLength(0);

      // 8. Get deleted entry → 404
      await request(app.getHttpServer())
        .get(`/diary/${entryId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  // ─────────────────────────────────────────────
  // Favorites flow
  // ─────────────────────────────────────────────
  describe('Favorites flow', () => {
    it('should create favorite, list favorites, log from favorite, and delete', async () => {
      const { accessToken } = await authHelper.createUser({
        email: 'fav-user@example.com',
        password: 'Password123!',
        name: 'Fav User',
      });

      // 1. Create favorite
      const createFavRes = await request(app.getHttpServer())
        .post('/diary/favorites')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Morning CBD',
          customProductName: 'CBD Full Spectrum',
          administrationMethod: 'oil',
          doseAmount: 3,
          doseUnit: 'drops',
          symptomKeys: ['pain', 'insomnia'],
        })
        .expect(201);

      expect(createFavRes.body).toHaveProperty('id');
      expect(createFavRes.body.name).toBe('Morning CBD');
      const favoriteId = createFavRes.body.id;

      // 2. List favorites
      const listFavRes = await request(app.getHttpServer())
        .get('/diary/favorites')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(listFavRes.body.favorites).toHaveLength(1);
      expect(listFavRes.body.favorites[0].name).toBe('Morning CBD');
      expect(listFavRes.body.favorites[0].symptomKeys).toEqual([
        'pain',
        'insomnia',
      ]);

      // 3. Log from favorite — creates a new diary entry
      const logRes = await request(app.getHttpServer())
        .post(`/diary/favorites/${favoriteId}/log`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          date: '2026-04-06',
          time: '09:30',
        })
        .expect(201);

      expect(logRes.body).toHaveProperty('id');
      expect(logRes.body.time).toBe('09:30');
      const loggedEntryId = logRes.body.id;

      // 4. Verify the logged entry exists with correct data
      const entryRes = await request(app.getHttpServer())
        .get(`/diary/${loggedEntryId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(entryRes.body.customProductName).toBe('CBD Full Spectrum');
      expect(entryRes.body.administrationMethod).toBe('oil');
      expect(Number(entryRes.body.doseAmount)).toBe(3);
      expect(entryRes.body.doseUnit).toBe('drops');
      expect(entryRes.body.symptoms).toHaveLength(2);

      // 5. Delete favorite
      await request(app.getHttpServer())
        .delete(`/diary/favorites/${favoriteId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // 6. Verify favorite deleted — list should be empty
      const afterDeleteFav = await request(app.getHttpServer())
        .get('/diary/favorites')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(afterDeleteFav.body.favorites).toHaveLength(0);
    });
  });

  // ─────────────────────────────────────────────
  // Summary
  // ─────────────────────────────────────────────
  describe('GET /diary/summary', () => {
    it('should return aggregated summary data', async () => {
      const { accessToken } = await authHelper.createUser({
        email: 'summary-user@example.com',
        password: 'Password123!',
        name: 'Summary User',
      });

      // Create a couple entries
      await request(app.getHttpServer())
        .post('/diary')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          date: '2026-04-05',
          time: '08:00',
          customProductName: 'CBD Oil',
          administrationMethod: 'oil',
          doseAmount: 5,
          doseUnit: 'drops',
          symptoms: [{ symptomKey: 'pain', severityBefore: 'severe' }],
          effects: [],
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/diary')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          date: '2026-04-06',
          time: '08:00',
          customProductName: 'CBD Oil',
          administrationMethod: 'oil',
          doseAmount: 5,
          doseUnit: 'drops',
          symptoms: [{ symptomKey: 'pain', severityBefore: 'moderate' }],
          effects: [],
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/diary')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          date: '2026-04-06',
          time: '20:00',
          customProductName: 'THC Flower',
          administrationMethod: 'flower',
          doseAmount: 0.5,
          doseUnit: 'g',
          symptoms: [{ symptomKey: 'insomnia', severityBefore: 'mild' }],
          effects: [],
        })
        .expect(201);

      const summaryRes = await request(app.getHttpServer())
        .get('/diary/summary?dateFrom=2026-04-01&dateTo=2026-04-30')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(summaryRes.body.totalEntries).toBe(3);
      expect(summaryRes.body.mostFrequentSymptoms).toBeDefined();
      expect(summaryRes.body.mostFrequentSymptoms[0].symptomKey).toBe('pain');
      expect(summaryRes.body.mostFrequentSymptoms[0].count).toBe(2);
      expect(summaryRes.body.mostUsedProduct.name).toBe('CBD Oil');
      expect(summaryRes.body.mostUsedProduct.count).toBe(2);
      expect(summaryRes.body.methodDistribution).toEqual({
        oil: 2,
        flower: 1,
      });
    });

    it('should return zeros for empty diary', async () => {
      const { accessToken } = await authHelper.createUser({
        email: 'empty-user@example.com',
        password: 'Password123!',
        name: 'Empty User',
      });

      const summaryRes = await request(app.getHttpServer())
        .get('/diary/summary')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(summaryRes.body.totalEntries).toBe(0);
      expect(summaryRes.body.mostFrequentSymptoms).toEqual([]);
      expect(summaryRes.body.mostUsedProduct).toBeNull();
      expect(summaryRes.body.methodDistribution).toEqual({});
    });
  });

  // ─────────────────────────────────────────────
  // Ownership — cross-user access
  // ─────────────────────────────────────────────
  describe('Ownership — user cannot access another user entries', () => {
    it('should return 404/403 when accessing another user entry', async () => {
      const { accessToken: tokenA } = await authHelper.createUser({
        email: 'userA-diary@example.com',
        password: 'Password123!',
        name: 'User A',
      });
      const { accessToken: tokenB } = await authHelper.createUser({
        email: 'userB-diary@example.com',
        password: 'Password123!',
        name: 'User B',
      });

      // User A creates an entry
      const createRes = await request(app.getHttpServer())
        .post('/diary')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          date: '2026-04-06',
          time: '10:00',
          customProductName: 'My Product',
          administrationMethod: 'oil',
          doseAmount: 3,
          doseUnit: 'drops',
          symptoms: [],
          effects: [],
        })
        .expect(201);

      const entryId = createRes.body.id;

      // User B tries to get User A's entry
      const getRes = await request(app.getHttpServer())
        .get(`/diary/${entryId}`)
        .set('Authorization', `Bearer ${tokenB}`);

      expect([403, 404]).toContain(getRes.status);

      // User B tries to update User A's entry
      const patchRes = await request(app.getHttpServer())
        .patch(`/diary/${entryId}`)
        .set('Authorization', `Bearer ${tokenB}`)
        .send({ notes: 'hacked' });

      expect([403, 404]).toContain(patchRes.status);

      // User B tries to delete User A's entry
      const deleteRes = await request(app.getHttpServer())
        .delete(`/diary/${entryId}`)
        .set('Authorization', `Bearer ${tokenB}`);

      expect([403, 404]).toContain(deleteRes.status);

      // User A's entry should still be intact
      await request(app.getHttpServer())
        .get(`/diary/${entryId}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);
    });

    it('should return 404/403 when accessing another user favorite', async () => {
      const { accessToken: tokenA } = await authHelper.createUser({
        email: 'favA@example.com',
        password: 'Password123!',
        name: 'Fav A',
      });
      const { accessToken: tokenB } = await authHelper.createUser({
        email: 'favB@example.com',
        password: 'Password123!',
        name: 'Fav B',
      });

      // User A creates a favorite
      const favRes = await request(app.getHttpServer())
        .post('/diary/favorites')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          name: 'My Fav',
          customProductName: 'Product',
          administrationMethod: 'oil',
          doseAmount: 2,
          doseUnit: 'drops',
          symptomKeys: ['pain'],
        })
        .expect(201);

      const favId = favRes.body.id;

      // User B tries to delete User A's favorite
      const deleteRes = await request(app.getHttpServer())
        .delete(`/diary/favorites/${favId}`)
        .set('Authorization', `Bearer ${tokenB}`);

      expect([403, 404]).toContain(deleteRes.status);

      // User B tries to log from User A's favorite
      const logRes = await request(app.getHttpServer())
        .post(`/diary/favorites/${favId}/log`)
        .set('Authorization', `Bearer ${tokenB}`)
        .send({ date: '2026-04-06', time: '12:00' });

      expect([403, 404]).toContain(logRes.status);
    });
  });
});
