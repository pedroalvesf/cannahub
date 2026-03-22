# CannHub — Prompts para Geração de Imagens

## Diretrizes visuais gerais

Todas as imagens devem seguir a identidade visual da CannHub:

- **Estilo**: Ilustração editorial minimalista, clean, acolhedora
- **Paleta**: Tons de verde (#243D2C, #3A6647, #5A9468), creme (#F4EFE4), beige (#F3EEDF), branco quente
- **Vibe**: Saúde, natureza, ciência, acolhimento — NUNCA recreativo, nunca "maconha", nunca psicodélico
- **Pessoas**: Diversas, brasileiras, expressões serenas/esperançosas. Sem fotos stock genéricas
- **Elementos botânicos**: Folhas de cannabis estilizadas (não realistas), gotas de óleo, frascos conta-gotas
- **Formato**: 16:9 (1200x675px) para heroes, 4:3 (800x600px) para cards
- **Background**: Limpo, gradiente suave ou flat — nunca ruidoso

---

## Imagens por condição de tratamento

### 1. Epilepsia Refratária
**Arquivo**: `treatments/epilepsia.jpg`
**Prompt (Midjourney/DALL-E)**:
```
Editorial medical illustration, minimalist style. A serene child's silhouette with a calm brain visualization, transitioning from chaotic electrical signals on the left to smooth, organized waves on the right. A stylized cannabis leaf and CBD molecule float nearby. Color palette: sage green (#5A9468), cream (#F4EFE4), soft white. Clean background, no text. Warm, hopeful mood. Medical-scientific context, NOT recreational. 16:9 aspect ratio, illustration style similar to health tech startups.
```

### 2. Dor Crônica e Neuropática
**Arquivo**: `treatments/dor-cronica.jpg`
**Prompt**:
```
Minimalist editorial illustration of pain relief. A human back silhouette with warm red pain points gradually fading to cool green relief zones. A dropper bottle with green oil drops creating ripple patterns of calm. Color palette: sage green, cream, soft coral fading to mint. Clean composition, medical context. Warm, soothing mood. No text. 16:9 aspect ratio.
```

### 3. Ansiedade e TEPT
**Arquivo**: `treatments/ansiedade.jpg`
**Prompt**:
```
Minimalist editorial illustration about anxiety relief. Split composition: left side shows a person's head profile with tangled, chaotic thought lines. Right side shows the same profile with smooth, flowing calm waves. A small cannabis leaf bridges the transition. Color palette: warm sage green, cream, muted coral. Peaceful, hopeful atmosphere. Medical context. No text. 16:9 aspect ratio.
```

### 4. Autismo / TEA
**Arquivo**: `treatments/autismo.jpg`
**Prompt**:
```
Warm editorial illustration of connection and care. An adult and child figure interacting, with soft puzzle pieces floating around them becoming complete. Gentle green botanical elements in the background. Color palette: sage green, cream, warm skin tones, soft blue accents. Emphasis on human connection, warmth, family. Medical-therapeutic context. No text. 16:9 aspect ratio.
```

### 5. Oncologia e Cuidados Paliativos
**Arquivo**: `treatments/oncologia.jpg`
**Prompt**:
```
Gentle, dignified editorial illustration about palliative care and comfort. A person resting peacefully, surrounded by soft green botanical elements (stylized leaves, not cannabis-specific). A gentle upward curve/graph suggesting improving quality of life. Color palette: sage green, warm cream, soft white. Mood: peaceful, dignified, comforting. Medical context. No text. 16:9 aspect ratio.
```

### 6. Parkinson e Neurodegenerativas
**Arquivo**: `treatments/parkinson.jpg`
**Prompt**:
```
Minimalist medical illustration about neuroprotection. A brain silhouette enclosed in a gentle protective shield made of stylized green leaves. On one side, tremor/vibration lines gradually stabilizing. A small CBD molecule nearby. Color palette: sage green, cream, soft mint. Scientific yet warm mood. Medical context. No text. 16:9 aspect ratio.
```

### 7. Esclerose Múltipla
**Arquivo**: `treatments/esclerose-multipla.jpg`
**Prompt**:
```
Editorial medical illustration about nerve protection. A stylized spinal cord/nerve pathway with myelin sheaths represented as green protective rings. A balance scale showing THC and CBD in equilibrium. Color palette: sage green, cream, soft gold accents. Clean, scientific composition. Medical context. No text. 16:9 aspect ratio.
```

### 8. Distúrbios do Sono
**Arquivo**: `treatments/insonia.jpg`
**Prompt**:
```
Peaceful editorial illustration about sleep. A person sleeping serenely under a blanket of soft green leaves. A crescent moon and subtle stars above. Small dropper bottle on a bedside surface. Color palette: deep sage green, cream, soft navy/indigo accents for night sky. Dreamy, calm, restful mood. No text. 16:9 aspect ratio.
```

---

## Imagens para a página hub (/tratamentos)

### Hero principal
**Arquivo**: `treatments/hero.jpg`
**Prompt**:
```
Wide editorial illustration for medical cannabis education page. A stylized human figure surrounded by floating scientific elements: a brain, a DNA helix, botanical leaves, molecular structures, and a dropper bottle — all in a harmonious, organized composition. Color palette: sage green (#5A9468), deep green (#243D2C), cream (#F4EFE4). Clean, airy background. Mood: scientific credibility meets human warmth. No text. 21:9 ultra-wide aspect ratio.
```

---

## Ícones para menu de condições (SVG)

Os ícones do menu devem ser SVG inline, monocromáticos, 24x24px, strokeWidth 1.5, estilo Feather/Lucide:

| Condição | Ícone sugerido | Descrição |
|----------|---------------|-----------|
| Epilepsia | Raio (zap) | Descarga elétrica → controle |
| Dor Crônica | Atividade (activity) | Pulso/onda de dor |
| Ansiedade | Coração (heart) | Batimento cardíaco → calma |
| Autismo | Pessoas (users) | Conexão social |
| Oncologia | Pulso (activity) | Monitor cardíaco |
| Parkinson | Escudo (shield) | Proteção neurológica |
| Esclerose | Círculo com + (plus-circle) | Equilíbrio THC:CBD |
| Insônia | Lua (moon) | Noite/sono |

---

## Plataformas recomendadas para geração

1. **Midjourney v6** — melhor para ilustrações editoriais com estilo consistente. Usar `--style raw` para controle de paleta
2. **DALL-E 3** — bom para composições conceituais com texto de prompt longo
3. **Leonardo.ai** — alternativa com controle de estilo via Image Guidance

### Dicas de geração

- Sempre incluir `--no text, words, letters, cannabis leaf realistic, smoke, psychedelic` nos negative prompts
- Usar `--ar 16:9` para heroes, `--ar 4:3` para cards
- Gerar 4 variações e escolher a mais alinhada com a paleta CannHub
- Após escolher, ajustar cores no Figma/Photoshop para match exato com a paleta (#243D2C, #5A9468, #F4EFE4)
- Exportar como WebP para performance (qualidade 85%, ~50-80KB por imagem)

### Nomenclatura de arquivos

```
public/treatments/
├── epilepsia.svg        ← placeholder SVG (atual)
├── epilepsia.webp       ← imagem definitiva (futura)
├── dor-cronica.svg
├── dor-cronica.webp
├── ...
```

Quando as imagens definitivas estiverem prontas, basta:
1. Colocar os `.webp` em `public/treatments/`
2. Atualizar o campo `image` em `src/data/treatments.ts` de `.svg` para `.webp`
