# Memory Game - Jogo da Memória Animado

Aplicativo educacional de jogo da memória com React Native, focado em ensinar animações com Gesture Handler e Reanimated.

## Início Rápido

```bash
# Instalar dependências
npm install

# Iniciar desenvolvimento
npm start

# Android
npm run android

# iOS
npm run ios
```

## Estrutura do Projeto (MVVM)

```
src/
├── models/              # Entidades de domínio
├── viewmodels/          # Lógica de apresentação (Zustand)
├── views/               # Componentes UI
│   └── components/
│       ├── ui/          # Componentes reutilizáveis
│       └── game/        # Componentes de jogo
├── services/            # Lógica de negócio
├── repositories/        # Persistência de dados
├── app/                 # Rotas (Expo Router)
├── constants/           # Constantes
└── utils/              # Utilitários
```

## Stack

- React Native + Expo
- TypeScript
- Zustand (estado global)
- Reanimated + Gesture Handler (animações)
- AsyncStorage (persistência)
- Expo Router (navegação)

## Documentação Completa

Veja [CLAUDE.md](./CLAUDE.md) para documentação detalhada incluindo:
- Arquitetura MVVM completa
- Guia de animações
- Fluxo de telas
- Boas práticas
- APIs e componentes

## Arquitetura MVVM

### Model
Entidades puras que representam dados do domínio.
- src/models/user.model.ts
- src/models/card.model.ts
- src/models/game.model.ts
- src/models/challenge.model.ts
- src/models/score.model.ts

### ViewModel
Stores Zustand que gerenciam estado e orquestram services.
- src/viewmodels/auth.viewmodel.ts
- src/viewmodels/game.viewmodel.ts
- src/viewmodels/ranking.viewmodel.ts

### View
Componentes React que renderizam a UI.
- src/views/components/ui/ - Componentes reutilizáveis
- src/views/components/game/ - Componentes de jogo
- src/app/ - Telas (Expo Router)

### Service
Funções puras com lógica de negócio.
- src/services/game.service.ts
- src/services/card.service.ts
- src/services/timer.service.ts
- src/services/haptic.service.ts

### Repository
Camada de persistência (AsyncStorage).
- src/repositories/storage.repository.ts
- src/repositories/auth.repository.ts
- src/repositories/ranking.repository.ts

## Telas

1. **Login** - Entrada do jogador
2. **Home** - Seleção de desafios
3. **Countdown** - Contagem 3, 2, 1
4. **Game** - Jogo da memória
5. **Finish** - Resultado final
6. **Ranking** - Histórico de partidas

## Categorias

- Linguagens de Programação (Fácil - 5min)
- Frameworks e Bibliotecas (Médio - 7min)
- Ferramentas de Desenvolvimento (Difícil - 10min)

## Recursos de Aprendizado

### Animações Implementadas
- Card flip 3D (rotateY)
- Countdown com scale
- Match celebration
- Micro-interações em botões
- Feedback háptico

### Conceitos Abordados
- Shared Values
- Animated Styles
- Gesture Composition
- Worklets
- Layout Animations

## Próximos Passos

Para implementar as telas:

1. **Atualizar rotas existentes** em src/app/ para usar os novos ViewModels
2. **Criar componentes de tela** usando componentes UI base
3. **Implementar animações** com Reanimated
4. **Integrar feedback háptico** nos eventos

## Exemplo de Uso

```typescript
// Em uma tela de jogo
import { useGameViewModel } from '@/viewmodels/game.viewmodel';
import { GameCard } from '@/views/components/game/game-card';

export default function GameScreen() {
  const { cards, selectCard } = useGameViewModel();

  return (
    <View>
      {cards.map((card) => (
        <GameCard
          key={card.id}
          card={card}
          onPress={selectCard}
        />
      ))}
    </View>
  );
}
```

## Licença

Projeto educacional desenvolvido para ensinar animações em React Native.

---

**Autor:** Breno Nascimento
**Objetivo:** Ensinar animações com React Native Reanimated
