# Arquitetura de Animações - Memory Game

## 📋 Sumário

1. [Visão Geral](#visão-geral)
2. [Estrutura de Pastas](#estrutura-de-pastas)
3. [Componentes da Arquitetura](#componentes-da-arquitetura)
4. [Tipos de Animações](#tipos-de-animações)
5. [Guia de Uso](#guia-de-uso)
6. [Melhores Práticas](#melhores-práticas)
7. [Exemplos de Implementação](#exemplos-de-implementação)
8. [Performance](#performance)

---

## 🎯 Visão Geral

Esta arquitetura foi projetada para gerenciar animações complexas no jogo da memória de forma escalável, performática e fácil de manter. Baseada nas melhores práticas de React Native Reanimated 3 (2025), a arquitetura separa:

- **Configurações**: Centralizadas e facilmente ajustáveis
- **Estado Global**: Gerenciado via Zustand para coordenação entre componentes
- **Lógica de Animação**: Encapsulada em hooks reutilizáveis
- **Orquestração**: Sistema para coordenar múltiplas animações complexas

### Princípios Fundamentais

1. **Performance First**: Todas animações rodam na UI thread via worklets
2. **Composable**: Animações podem ser combinadas facilmente
3. **Type-Safe**: TypeScript em toda a arquitetura
4. **Separation of Concerns**: Cada hook tem uma responsabilidade única
5. **Declarativo**: API simples e intuitiva

---

## 📁 Estrutura de Pastas

```
src/animations/
├── config/
│   └── animation.config.ts          # Configurações centralizadas
├── store/
│   └── animation.store.ts           # Estado global (Zustand)
├── types/
│   └── animation.types.ts           # Definições de tipos
├── utils/
│   └── animation.utils.ts           # Funções auxiliares
├── hooks/
│   ├── useCardEntryAnimation.ts     # Animação de entrada dos cards
│   ├── useCardShakeAnimation.ts     # Animação de erro (shake)
│   ├── useCardSuccessAnimation.ts   # Animação de sucesso
│   ├── useCardSelectionAnimation.ts # Animação de seleção
│   └── useAnimationOrchestrator.ts  # Orquestração de animações
└── index.ts                         # Exports públicos
```

---

## 🏗️ Componentes da Arquitetura

### 1. Types (`animation.types.ts`)

Define todos os tipos utilizados no sistema de animações:

```typescript
// Tipo de animação de entrada
type CardEntryAnimationType = 'throw' | 'deck';

// Estados possíveis de um card
type CardAnimationState =
  | 'idle'
  | 'entering'
  | 'selecting'
  | 'selected'
  | 'shaking'
  | 'success'
  | 'matched'
  | 'exiting';

// Configurações de timing
interface AnimationTimings {
  entry: {
    throw: { duration: number; delayBetweenCards: number };
    deck: { duration: number; delayBetweenCards: number };
  };
  selection: { duration: number; scale: number };
  shake: { duration: number; distance: number; repeat: number };
  success: { duration: number; scale: number; particleCount: number };
  exit: { duration: number };
}
```

### 2. Configuration (`animation.config.ts`)

Centraliza todas as configurações de animação:

```typescript
export const ANIMATION_TIMINGS: AnimationTimings = {
  entry: {
    throw: { duration: 600, delayBetweenCards: 80 },
    deck: { duration: 500, delayBetweenCards: 60 },
  },
  selection: { duration: 150, scale: 1.05 },
  shake: { duration: 400, distance: 10, repeat: 3 },
  success: { duration: 600, scale: 1.1, particleCount: 8 },
  exit: { duration: 300 },
};

export const ANIMATION_EASINGS = {
  entry: Easing.out(Easing.cubic),
  exit: Easing.in(Easing.cubic),
  bounce: Easing.bounce,
  elastic: Easing.elastic(1.2),
  linear: Easing.linear,
};
```

**Vantagens:**
- Ajustes centralizados
- Fácil experimentação
- Consistência visual
- Documentação implícita

### 3. Store (`animation.store.ts`)

Gerencia o estado global das animações usando Zustand:

```typescript
interface AnimationStore {
  entryAnimationType: CardEntryAnimationType;
  isAnimating: boolean;
  cardStates: Map<string, CardAnimationState>;

  setEntryAnimationType: (type: CardEntryAnimationType) => void;
  setIsAnimating: (isAnimating: boolean) => void;
  setCardState: (cardId: string, state: CardAnimationState) => void;
  getCardState: (cardId: string) => CardAnimationState;
  resetCardStates: () => void;
  resetAnimation: () => void;
}
```

**Responsabilidades:**
- Armazenar tipo de animação de entrada (throw/deck)
- Rastrear estado de cada card individualmente
- Indicar se animações estão em andamento
- Fornecer métodos para atualização e reset

### 4. Utils (`animation.utils.ts`)

Funções auxiliares para cálculos matemáticos:

```typescript
// Calcula posição de um card no grid
calculateCardPosition(index, gridColumns, cardWidth, cardHeight, ...): CardPosition

// Gera rotação aleatória
getRandomRotation(min, max): number

// Gera delay aleatório com variância
getRandomDelay(baseDelay, variance): number

// Funções de easing customizadas
easeOutCubic(t): number
easeInOutCubic(t): number

// Interpolação linear
lerp(start, end, progress): number

// Limita valor entre min e max
clamp(value, min, max): number
```

---

## 🎨 Tipos de Animações

### 1. **Entry Animations** (Animações de Entrada)

Dois tipos disponíveis:

#### Tipo "Throw" (Jogar)
Cards são "jogados" do canto inferior direito, um por um, para suas posições finais.

**Características:**
- Posição inicial: `{ x: 300, y: 600 }`
- Rotação inicial: `-30deg`
- Animação com `withSpring` para efeito elástico
- Delay sequencial entre cards: `80ms`
- Duração: `600ms`

```typescript
const { animatedStyle } = useCardEntryAnimation({
  cardIndex: 0,
  targetPosition: { x: 20, y: 100, index: 0 },
  shouldAnimate: true,
});
```

#### Tipo "Deck" (Baralho)
Cards começam empilhados como um deck no centro inferior, depois vão para suas posições.

**Características:**
- Posição inicial: `{ x: 0, y: 400 }` (centralizado)
- Sem rotação inicial
- Animação com `withTiming` e easing cubic
- Delay sequencial entre cards: `60ms`
- Duração: `500ms`

### 2. **Selection Animation** (Animação de Seleção)

Feedback visual ao pressionar um card.

**Características:**
- Escala: `1.0 → 1.05 → 1.0`
- Duração: `150ms`
- Spring animation para feedback natural
- Ativada em `onPressIn` e desativada em `onPressOut`

```typescript
const { animatedStyle, onPressIn, onPressOut } = useCardSelectionAnimation();

<Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
  <Animated.View style={[styles.card, animatedStyle]} />
</Pressable>
```

### 3. **Shake Animation** (Animação de Erro)

Indica que os cards selecionados não combinam.

**Características:**
- Movimento horizontal: `±10px`
- Rotação: `±5deg`
- Repetições: `3 vezes`
- Duração total: `400ms`
- Usa `withSequence` e `withRepeat`

```typescript
const { animatedStyle, shake } = useCardShakeAnimation();

// Quando cards não combinam
if (!cardsMatch) {
  shake();
  triggerHaptic('error');
}
```

### 4. **Success Animation** (Animação de Sucesso)

Celebra quando cards combinam corretamente.

**Características:**
- Escala: `1.0 → 1.1 → 1.0`
- Spring animation com bounce
- Duração: `600ms`
- Preparado para integração com partículas

```typescript
const { animatedStyle, playSuccess, fadeOut } = useCardSuccessAnimation();

// Quando cards combinam
if (cardsMatch) {
  playSuccess();
  triggerHaptic('success');

  // Depois remove os cards
  setTimeout(() => fadeOut(), 500);
}
```

### 5. **Animation Orchestrator** (Orquestrador)

Coordena múltiplas animações e feedback háptico.

```typescript
const {
  animationState,
  triggerHaptic,
  updateState,
  notifyCompletion
} = useAnimationOrchestrator({
  cardId: card.id,
  onAnimationComplete: () => console.log('Done!'),
});

// Trigger haptic feedback
triggerHaptic('light');   // Light impact
triggerHaptic('medium');  // Medium impact
triggerHaptic('heavy');   // Heavy impact
triggerHaptic('success'); // Success notification
triggerHaptic('error');   // Error notification
```

---

## 📖 Guia de Uso

### Setup Inicial

1. **Configurar o tipo de entrada no início do jogo:**

```typescript
import { useAnimationStore } from '@/animations';

function GameSetup() {
  const { setEntryAnimationType } = useAnimationStore();

  // Escolher aleatoriamente ou baseado em preferência
  useEffect(() => {
    const types: CardEntryAnimationType[] = ['throw', 'deck'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    setEntryAnimationType(randomType);
  }, []);
}
```

2. **Implementar animação de entrada nos cards:**

```typescript
function AnimatedCard({ card, index }) {
  const targetPosition = calculateCardPosition(
    index,
    3, // gridColumns
    115, // cardWidth
    115, // cardHeight
    8, // marginBottom
    20, // paddingHorizontal
    Dimensions.get('window').width
  );

  const { animatedStyle } = useCardEntryAnimation({
    cardIndex: index,
    targetPosition,
    shouldAnimate: gameStatus === 'starting',
  });

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      {/* Card content */}
    </Animated.View>
  );
}
```

3. **Adicionar interação de seleção:**

```typescript
function InteractiveCard({ card }) {
  const selection = useCardSelectionAnimation();
  const shake = useCardShakeAnimation();
  const success = useCardSuccessAnimation();
  const { triggerHaptic } = useAnimationOrchestrator({ cardId: card.id });

  const handlePress = () => {
    triggerHaptic('light');
    selectCard(card.id);
  };

  useEffect(() => {
    if (card.state === 'error') {
      shake.shake();
      triggerHaptic('error');
    } else if (card.state === 'matched') {
      success.playSuccess();
      triggerHaptic('success');
    }
  }, [card.state]);

  return (
    <Pressable
      onPressIn={selection.onPressIn}
      onPressOut={selection.onPressOut}
      onPress={handlePress}
    >
      <Animated.View
        style={[
          styles.card,
          selection.animatedStyle,
          shake.animatedStyle,
          success.animatedStyle
        ]}
      >
        {/* Card content */}
      </Animated.View>
    </Pressable>
  );
}
```

---

## ✨ Melhores Práticas

### 1. Performance

**✅ DO:**
- Use `worklet` para código que roda na UI thread
- Anime `transform` e `opacity` (GPU-accelerated)
- Limite número de animações simultâneas (máx 100 no Android)
- Use `useSharedValue` para valores animados
- Reutilize animated styles com `useAnimatedStyle`

**❌ DON'T:**
- Não anime `width`, `height`, `margin`, `padding` (causa reflow)
- Não faça chamadas de API dentro de worklets
- Não crie `useSharedValue` dentro de loops
- Não use inline styles em componentes animados

### 2. Acessibilidade

```typescript
import { AccessibilityInfo } from 'react-native';

function useReducedMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  return reduceMotion;
}

// Uso
function AnimatedComponent() {
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0 : ANIMATION_TIMINGS.entry.throw.duration;
}
```

### 3. Debugging

```typescript
// Adicione logs em worklets
const animatedStyle = useAnimatedStyle(() => {
  console.log('[UI Thread] Scale:', scale.value);
  return { transform: [{ scale: scale.value }] };
});

// Monitor estado no store
useEffect(() => {
  console.log('Animation State:', useAnimationStore.getState());
}, []);
```

### 4. Organização de Código

```typescript
// ✅ Composição de hooks
function useCardAnimations(card: Card) {
  const entry = useCardEntryAnimation({ /* ... */ });
  const selection = useCardSelectionAnimation();
  const shake = useCardShakeAnimation();
  const success = useCardSuccessAnimation();

  return {
    entry,
    selection,
    shake,
    success,
  };
}

// ✅ Combine animated styles
<Animated.View
  style={[
    styles.base,
    entry.animatedStyle,
    selection.animatedStyle,
    shake.animatedStyle,
    success.animatedStyle,
  ]}
/>
```

---

## 🎬 Exemplos de Implementação

### Exemplo Completo: Card Animado

```typescript
import { useCardEntryAnimation, useCardSelectionAnimation, useCardShakeAnimation, useCardSuccessAnimation, useAnimationOrchestrator, calculateCardPosition } from '@/animations';

interface AnimatedGameCardProps {
  card: Card;
  index: number;
  onPress: (id: string) => void;
  disabled: boolean;
}

export function AnimatedGameCard({ card, index, onPress, disabled }: AnimatedGameCardProps) {
  // Calculate target position
  const targetPosition = calculateCardPosition(
    index,
    3, // columns
    115, 115, 8, 20,
    Dimensions.get('window').width
  );

  // Setup animations
  const entry = useCardEntryAnimation({
    cardIndex: index,
    targetPosition,
    shouldAnimate: true,
  });

  const selection = useCardSelectionAnimation();
  const shake = useCardShakeAnimation();
  const success = useCardSuccessAnimation();

  const { triggerHaptic } = useAnimationOrchestrator({
    cardId: card.id
  });

  // Handle card state changes
  useEffect(() => {
    if (card.state === 'error') {
      shake.shake();
      triggerHaptic('error');
    } else if (card.state === 'matched') {
      success.playSuccess();
      triggerHaptic('success');
      setTimeout(() => success.fadeOut(), 400);
    }
  }, [card.state]);

  const handlePress = () => {
    if (!disabled && !card.isMatched && !card.isFlipped) {
      triggerHaptic('light');
      onPress(card.id);
    }
  };

  return (
    <Pressable
      onPressIn={selection.onPressIn}
      onPressOut={selection.onPressOut}
      onPress={handlePress}
      disabled={disabled}
    >
      <Animated.View
        style={[
          styles.card,
          entry.animatedStyle,
          selection.animatedStyle,
          shake.animatedStyle,
          success.animatedStyle,
        ]}
      >
        <CardContent card={card} />
      </Animated.View>
    </Pressable>
  );
}
```

### Exemplo: Orquestração de Múltiplos Cards

```typescript
function GameBoard() {
  const { isAnimating, setIsAnimating } = useAnimationStore();
  const [cardsReady, setCardsReady] = useState(false);

  // Aguarda todas animações de entrada terminarem
  useEffect(() => {
    if (gameStatus === 'starting') {
      setIsAnimating(true);

      const totalDelay = cards.length * ANIMATION_TIMINGS.entry.throw.delayBetweenCards;
      const animationTime = totalDelay + ANIMATION_TIMINGS.entry.throw.duration;

      setTimeout(() => {
        setIsAnimating(false);
        setCardsReady(true);
      }, animationTime);
    }
  }, [gameStatus]);

  return (
    <View>
      {cards.map((card, index) => (
        <AnimatedGameCard
          key={card.id}
          card={card}
          index={index}
          onPress={handleCardPress}
          disabled={isAnimating || !cardsReady}
        />
      ))}
    </View>
  );
}
```

---

## ⚡ Performance

### Métricas Alvo

- **FPS**: 60fps constante (iOS) / 60fps+ (Android high-end)
- **Latência de entrada**: < 16ms
- **Memory**: < 100MB adicional durante animações
- **Limite de animações simultâneas**:
  - Android low-end: 50 componentes
  - Android mid-end: 100 componentes
  - iOS: 500 componentes

### Otimizações Implementadas

1. **Worklets**: Todo código de animação roda na UI thread
2. **GPU Acceleration**: Apenas `transform` e `opacity`
3. **Shared Values**: Evita bridge entre threads
4. **Memoization**: Styles animados são memorizados
5. **Batch Updates**: Store updates são batched

### Troubleshooting Performance

```typescript
// Monitorar FPS
import { PerformanceMonitor } from 'react-native-performance-monitor';

<PerformanceMonitor
  overlay
  onFrameDrop={(frameDropInfo) => {
    console.warn('Frame drop detected:', frameDropInfo);
  }}
/>

// Perfil de animação
console.time('animation-entry');
// ... trigger animation
setTimeout(() => {
  console.timeEnd('animation-entry');
}, ANIMATION_TIMINGS.entry.throw.duration);
```

---

## 🔄 Extensibilidade

Para adicionar novas animações:

1. **Defina o tipo** em `animation.types.ts`
2. **Configure timings** em `animation.config.ts`
3. **Crie o hook** em `hooks/useNewAnimation.ts`
4. **Exporte** no `index.ts`
5. **Documente** aqui

Exemplo:

```typescript
// 1. Type
export type CardBounceState = 'bouncing' | 'idle';

// 2. Config
export const ANIMATION_TIMINGS = {
  // ...
  bounce: {
    duration: 300,
    height: 20,
    repeat: 2,
  },
};

// 3. Hook
export function useCardBounceAnimation() {
  const translateY = useSharedValue(0);

  const bounce = () => {
    translateY.value = withSequence(
      withTiming(-ANIMATION_TIMINGS.bounce.height, { duration: 150 }),
      withRepeat(
        withTiming(ANIMATION_TIMINGS.bounce.height, { duration: 150 }),
        ANIMATION_TIMINGS.bounce.repeat * 2,
        true
      ),
      withTiming(0, { duration: 150 })
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return { animatedStyle, bounce };
}

// 4. Export
export * from './hooks/useCardBounceAnimation';
```

---

## 📚 Referências

- [React Native Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/)
- [Reanimated 3 Best Practices 2025](https://dev.to/erenelagz/react-native-reanimated-3-the-ultimate-guide-to-high-performance-animations-in-2025-4ae4)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [React Native Performance Guide](https://reactnative.dev/docs/performance)

---

## 🤝 Contribuindo

Ao adicionar novas animações:

1. Siga a estrutura de pastas existente
2. Use TypeScript com tipos explícitos
3. Adicione testes de performance
4. Documente no README
5. Considere acessibilidade (reduce motion)
6. Otimize para low-end devices

---

**Versão:** 1.0.0
**Data:** Janeiro 2026
**Autor:** Claude Code Assistant
