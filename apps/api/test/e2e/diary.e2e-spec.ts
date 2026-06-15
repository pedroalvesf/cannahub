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

    it('POST /diary/entries/:id/follow-ups → 401', async () => {
      await request(app.getHttpServer())
        .post('/diary/entries/00000000-0000-0000-0000-000000000000/follow-ups')
        .send({})
        .expect(401);
    });

    it('PATCH /diary/follow-ups/:id → 401', async () => {
      await request(app.getHttpServer())
        .patch('/diary/follow-ups/00000000-0000-0000-0000-000000000000')
        .send({})
        .expect(401);
    });

    it('DELETE /diary/follow-ups/:id → 401', async () => {
      await request(app.getHttpServer())
        .delete('/diary/follow-ups/00000000-0000-0000-0000-000000000000')
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
  // Entry CRUD flow (severidade numérica 0-10, sem efeitos no registro)
  // ─────────────────────────────────────────────
  describe('Diary entry CRUD flow', () => {
    it('should create, list, get detail, update and delete an entry', async () => {
      const { accessToken } = await authHelper.createUser({
        email: 'diary-user@example.com',
        password: 'Password123!',
        name: 'Diary User',
      });

      // 1. Create entry with symptoms (severity 0-10), no effects on the entry
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
          targetCondition: 'chronic_pain',
          symptoms: [
            { symptomKey: 'pain', severityBefore: 7 },
            { symptomKey: 'anxiety', severityBefore: 5 },
          ],
        })
        .expect(201);

      expect(createRes.body).toHaveProperty('id');
      expect(createRes.body.administrationMethod).toBe('oil');
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
      expect(listed.symptoms[0].severityBefore).toBe(7);
      expect(listed.followUps).toHaveLength(0);

      // 3. Get entry detail
      const detailRes = await request(app.getHttpServer())
        .get(`/diary/${entryId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(detailRes.body.id).toBe(entryId);
      expect(detailRes.body.notes).toBe('Morning dose');
      expect(detailRes.body.targetCondition).toBe('chronic_pain');
      expect(detailRes.body.symptoms).toHaveLength(2);
      expect(detailRes.body.followUps).toHaveLength(0);

      // 4. Update entry (notes + favorite)
      await request(app.getHttpServer())
        .patch(`/diary/${entryId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ notes: 'Updated note', isFavorite: true })
        .expect(200);

      const afterUpdate = await request(app.getHttpServer())
        .get(`/diary/${entryId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      expect(afterUpdate.body.notes).toBe('Updated note');
      expect(afterUpdate.body.isFavorite).toBe(true);

      // 5. Delete entry
      await request(app.getHttpServer())
        .delete(`/diary/${entryId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // 6. Verify deleted
      const afterDelete = await request(app.getHttpServer())
        .get('/diary')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      expect(afterDelete.body.total).toBe(0);

      await request(app.getHttpServer())
        .get(`/diary/${entryId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  // ─────────────────────────────────────────────
  // Follow-up flow (antes → depois, múltiplos follow-ups)
  // ─────────────────────────────────────────────
  describe('Follow-up flow (antes → depois)', () => {
    async function createEntryWithPain(accessToken: string) {
      const createRes = await request(app.getHttpServer())
        .post('/diary')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          date: '2026-04-06',
          time: '08:00',
          customProductName: 'CBD Oil',
          administrationMethod: 'oil',
          doseAmount: 4,
          doseUnit: 'drops',
          symptoms: [{ symptomKey: 'pain', severityBefore: 8 }],
        })
        .expect(201);

      const entryId = createRes.body.id;

      const detailRes = await request(app.getHttpServer())
        .get(`/diary/${entryId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const symptomLogId = detailRes.body.symptoms[0].id;
      return { entryId, symptomLogId };
    }

    it('should create, re-evaluate (multi), update and delete follow-ups', async () => {
      const { accessToken } = await authHelper.createUser({
        email: 'followup-user@example.com',
        password: 'Password123!',
        name: 'FollowUp User',
      });

      const { entryId, symptomLogId } = await createEntryWithPain(accessToken);

      // 1. First follow-up (2h depois) — dor caiu de 8 para 3
      const fu1Res = await request(app.getHttpServer())
        .post(`/diary/entries/${entryId}/follow-ups`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          evaluatedAt: '2026-04-06T10:00:00.000Z',
          notes: 'Senti alívio',
          tags: ['as_expected'],
          symptomAssessments: [{ symptomLogId, severityAfter: 3 }],
          effects: [{ effectKey: 'relaxed', isPositive: true }],
        })
        .expect(201);

      expect(fu1Res.body).toHaveProperty('id');
      const followUpId = fu1Res.body.id;

      // 2. Entry detail reflects the follow-up
      let detail = await request(app.getHttpServer())
        .get(`/diary/${entryId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      expect(detail.body.followUps).toHaveLength(1);
      expect(detail.body.followUps[0].symptomAssessments[0].severityAfter).toBe(3);
      expect(detail.body.followUps[0].effects).toHaveLength(1);
      expect(detail.body.followUps[0].tags).toEqual(['as_expected']);

      // 3. Second follow-up (manhã seguinte) — multi follow-up
      await request(app.getHttpServer())
        .post(`/diary/entries/${entryId}/follow-ups`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          evaluatedAt: '2026-04-07T08:00:00.000Z',
          symptomAssessments: [{ symptomLogId, severityAfter: 1 }],
        })
        .expect(201);

      detail = await request(app.getHttpServer())
        .get(`/diary/${entryId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      expect(detail.body.followUps).toHaveLength(2);

      // 4. Summary reflects before (8) and latest after (1)
      const summary = await request(app.getHttpServer())
        .get('/diary/summary?dateFrom=2026-04-01&dateTo=2026-04-30')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const painDelta = summary.body.symptomDeltas.find(
        (d: any) => d.symptomKey === 'pain',
      );
      expect(painDelta.avgSeverityBefore).toBe(8);
      expect(painDelta.avgSeverityAfter).toBe(1);

      // 5. Update the first follow-up (replace assessment severity)
      await request(app.getHttpServer())
        .patch(`/diary/follow-ups/${followUpId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          notes: 'Revisado',
          symptomAssessments: [{ symptomLogId, severityAfter: 5 }],
        })
        .expect(200);

      detail = await request(app.getHttpServer())
        .get(`/diary/${entryId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const updatedFollowUp = detail.body.followUps.find(
        (f: any) => f.id === followUpId,
      );
      expect(updatedFollowUp.notes).toBe('Revisado');
      expect(updatedFollowUp.symptomAssessments[0].severityAfter).toBe(5);

      // 6. Delete the first follow-up
      await request(app.getHttpServer())
        .delete(`/diary/follow-ups/${followUpId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      detail = await request(app.getHttpServer())
        .get(`/diary/${entryId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      expect(detail.body.followUps).toHaveLength(1);
    });

    it('should reject a follow-up evaluated before the entry date', async () => {
      const { accessToken } = await authHelper.createUser({
        email: 'fu-invalid-date@example.com',
        password: 'Password123!',
        name: 'FU Date',
      });
      const { entryId } = await createEntryWithPain(accessToken);

      await request(app.getHttpServer())
        .post(`/diary/entries/${entryId}/follow-ups`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ evaluatedAt: '2026-04-05T10:00:00.000Z' })
        .expect(400);
    });

    it('should reject a follow-up referencing a foreign symptomLogId', async () => {
      const { accessToken } = await authHelper.createUser({
        email: 'fu-invalid-symptom@example.com',
        password: 'Password123!',
        name: 'FU Symptom',
      });
      const { entryId } = await createEntryWithPain(accessToken);

      await request(app.getHttpServer())
        .post(`/diary/entries/${entryId}/follow-ups`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          evaluatedAt: '2026-04-06T10:00:00.000Z',
          symptomAssessments: [
            {
              symptomLogId: '00000000-0000-0000-0000-000000000000',
              severityAfter: 2,
            },
          ],
        })
        .expect(400);
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
      const favoriteId = createFavRes.body.id;

      const listFavRes = await request(app.getHttpServer())
        .get('/diary/favorites')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      expect(listFavRes.body.favorites).toHaveLength(1);
      expect(listFavRes.body.favorites[0].symptomKeys).toEqual([
        'pain',
        'insomnia',
      ]);

      const logRes = await request(app.getHttpServer())
        .post(`/diary/favorites/${favoriteId}/log`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ date: '2026-04-06', time: '09:30' })
        .expect(201);
      expect(logRes.body).toHaveProperty('id');
      const loggedEntryId = logRes.body.id;

      const entryRes = await request(app.getHttpServer())
        .get(`/diary/${loggedEntryId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      expect(entryRes.body.customProductName).toBe('CBD Full Spectrum');
      expect(entryRes.body.symptoms).toHaveLength(2);

      await request(app.getHttpServer())
        .delete(`/diary/favorites/${favoriteId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

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
          symptoms: [{ symptomKey: 'pain', severityBefore: 9 }],
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
          symptoms: [{ symptomKey: 'pain', severityBefore: 6 }],
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
          symptoms: [{ symptomKey: 'insomnia', severityBefore: 4 }],
        })
        .expect(201);

      const summaryRes = await request(app.getHttpServer())
        .get('/diary/summary?dateFrom=2026-04-01&dateTo=2026-04-30')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(summaryRes.body.totalEntries).toBe(3);
      expect(summaryRes.body.mostFrequentSymptoms[0].symptomKey).toBe('pain');
      expect(summaryRes.body.mostFrequentSymptoms[0].count).toBe(2);
      expect(summaryRes.body.mostUsedProduct.name).toBe('CBD Oil');
      expect(summaryRes.body.mostUsedProduct.count).toBe(2);
      expect(summaryRes.body.methodDistribution).toEqual({ oil: 2, flower: 1 });
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
  describe('Ownership — user cannot access another user data', () => {
    it('should block access to another user entry', async () => {
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
        })
        .expect(201);
      const entryId = createRes.body.id;

      const getRes = await request(app.getHttpServer())
        .get(`/diary/${entryId}`)
        .set('Authorization', `Bearer ${tokenB}`);
      expect([403, 404]).toContain(getRes.status);

      const patchRes = await request(app.getHttpServer())
        .patch(`/diary/${entryId}`)
        .set('Authorization', `Bearer ${tokenB}`)
        .send({ notes: 'hacked' });
      expect([403, 404]).toContain(patchRes.status);

      const deleteRes = await request(app.getHttpServer())
        .delete(`/diary/${entryId}`)
        .set('Authorization', `Bearer ${tokenB}`);
      expect([403, 404]).toContain(deleteRes.status);

      await request(app.getHttpServer())
        .get(`/diary/${entryId}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);
    });

    it('should block follow-up actions on another user entry', async () => {
      const { accessToken: tokenA } = await authHelper.createUser({
        email: 'fuA@example.com',
        password: 'Password123!',
        name: 'FU A',
      });
      const { accessToken: tokenB } = await authHelper.createUser({
        email: 'fuB@example.com',
        password: 'Password123!',
        name: 'FU B',
      });

      // A creates entry + follow-up
      const createRes = await request(app.getHttpServer())
        .post('/diary')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          date: '2026-04-06',
          time: '10:00',
          customProductName: 'Product A',
          administrationMethod: 'oil',
          doseAmount: 3,
          doseUnit: 'drops',
          symptoms: [{ symptomKey: 'pain', severityBefore: 6 }],
        })
        .expect(201);
      const entryId = createRes.body.id;

      // B cannot create a follow-up on A's entry
      const fuByB = await request(app.getHttpServer())
        .post(`/diary/entries/${entryId}/follow-ups`)
        .set('Authorization', `Bearer ${tokenB}`)
        .send({ evaluatedAt: '2026-04-06T12:00:00.000Z' });
      expect([403, 404]).toContain(fuByB.status);

      // A creates a follow-up
      const fuRes = await request(app.getHttpServer())
        .post(`/diary/entries/${entryId}/follow-ups`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ evaluatedAt: '2026-04-06T12:00:00.000Z' })
        .expect(201);
      const followUpId = fuRes.body.id;

      // B cannot update or delete A's follow-up
      const updByB = await request(app.getHttpServer())
        .patch(`/diary/follow-ups/${followUpId}`)
        .set('Authorization', `Bearer ${tokenB}`)
        .send({ notes: 'hack' });
      expect([403, 404]).toContain(updByB.status);

      const delByB = await request(app.getHttpServer())
        .delete(`/diary/follow-ups/${followUpId}`)
        .set('Authorization', `Bearer ${tokenB}`);
      expect([403, 404]).toContain(delByB.status);
    });

    it('should block access to another user favorite', async () => {
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

      const deleteRes = await request(app.getHttpServer())
        .delete(`/diary/favorites/${favId}`)
        .set('Authorization', `Bearer ${tokenB}`);
      expect([403, 404]).toContain(deleteRes.status);

      const logRes = await request(app.getHttpServer())
        .post(`/diary/favorites/${favId}/log`)
        .set('Authorization', `Bearer ${tokenB}`)
        .send({ date: '2026-04-06', time: '12:00' });
      expect([403, 404]).toContain(logRes.status);
    });
  });
});
