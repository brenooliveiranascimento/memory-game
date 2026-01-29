# Animation System - Quick Start

Sistema de animações escalável e performático para o Memory Game usando React Native Reanimated 3.

## 📦 Estrutura

```
animations/
├── config/       # Configurações de timing e easing
├── store/        # Estado global (Zustand)
├── types/        # TypeScript types
├── utils/        # Funções auxiliares
├── hooks/        # Hooks de animação
└── index.ts      # Exports públicos
```

## 🚀 Uso Rápido

### 1. Setup Inicial

```typescript
import { useAnimationStore } from '@/animations';

// Definir tipo de entrada
const { setEntryAnimationType } = useAnimationStore();
setEntryAnimationType('throw'); // ou 'deck'
```

### 2. Animação de Entrada

```typescript
import { useCardEntryAnimation, calculateCardPosition } from '@/animations';

const targetPosition = calculateCardPosition(index, 3, 115, 115, 8, 20, screenWidth);

const { animatedStyle } = useCardEntryAnimation({
  cardIndex: index,
  targetPosition,
  shouldAnimate: true,
});

<Animated.View style={[styles.card, animatedStyle]} />
```

### 3. Animações Interativas

```typescript
import {
  useCardSelectionAnimation,
  useCardShakeAnimation,
  useCardSuccessAnimation,
  useAnimationOrchestrator,
} from '@/animations';

const selection = useCardSelectionAnimation();
const shake = useCardShakeAnimation();
const success = useCardSuccessAnimation();
const { triggerHaptic } = useAnimationOrchestrator({ cardId: card.id });

// Seleção
<Pressable
  onPressIn={selection.onPressIn}
  onPressOut={selection.onPressOut}
  onPress={handlePress}
>
  <Animated.View style={[selection.animatedStyle]} />
</Pressable>

// Erro
if (error) {
  shake.shake();
  triggerHaptic('error');
}

// Sucesso
if (success) {
  success.playSuccess();
  triggerHaptic('success');
}
```

## 🎨 Tipos de Animação

| Hook | Uso | Duração |
|------|-----|---------|
| `useCardEntryAnimation` | Entrada dos cards | 500-600ms |
| `useCardSelectionAnimation` | Feedback ao tocar | 150ms |
| `useCardShakeAnimation` | Erro (cards não combinam) | 400ms |
| `useCardSuccessAnimation` | Sucesso (cards combinam) | 600ms |
| `useAnimationOrchestrator` | Coordenação e haptics | - |

## ⚙️ Configuração

Todas as configurações em `config/animation.config.ts`:

```typescript
export const ANIMATION_TIMINGS = {
  entry: {
    throw: { duration: 600, delayBetweenCards: 80 },
    deck: { duration: 500, delayBetweenCards: 60 },
  },
  selection: { duration: 150, scale: 1.05 },
  shake: { duration: 400, distance: 10, repeat: 3 },
  success: { duration: 600, scale: 1.1, particleCount: 8 },
  exit: { duration: 300 },
};
```

## 🎯 Estado Global

```typescript
const {
  entryAnimationType,      // 'throw' | 'deck'
  isAnimating,             // boolean
  cardStates,              // Map<string, CardAnimationState>
  setEntryAnimationType,
  setIsAnimating,
  setCardState,
  getCardState,
  resetCardStates,
  resetAnimation,
} = useAnimationStore();
```

## 📖 Documentação Completa

Ver `docs/ANIMATION_ARCHITECTURE.md` para:
- Arquitetura detalhada
- Exemplos completos
- Melhores práticas
- Performance tips
- Guia de extensibilidade

## 🔧 Utilitários

```typescript
import { calculateCardPosition, getRandomRotation, lerp, clamp } from '@/animations';

// Calcular posição de um card no grid
const position = calculateCardPosition(index, columns, width, height, margin, padding, screenWidth);

// Rotação aleatória
const rotation = getRandomRotation(-15, 15);

// Interpolação linear
const value = lerp(0, 100, 0.5); // 50

// Limitar valor
const clamped = clamp(150, 0, 100); // 100
```

## 💡 Tips

1. **Performance**: Use apenas `transform` e `opacity`
2. **Acessibilidade**: Verifique `reduceMotionEnabled`
3. **Debug**: Use `console.log` em `useAnimatedStyle`
4. **Composição**: Combine múltiplos `animatedStyle`
5. **Haptics**: Use `triggerHaptic` para feedback

## 📚 Exemplo Completo

```typescript
function AnimatedCard({ card, index }) {
  const targetPos = calculateCardPosition(index, 3, 115, 115, 8, 20, width);
  const entry = useCardEntryAnimation({ cardIndex: index, targetPosition: targetPos, shouldAnimate: true });
  const selection = useCardSelectionAnimation();
  const shake = useCardShakeAnimation();
  const success = useCardSuccessAnimation();
  const { triggerHaptic } = useAnimationOrchestrator({ cardId: card.id });

  useEffect(() => {
    if (card.error) {
      shake.shake();
      triggerHaptic('error');
    } else if (card.matched) {
      success.playSuccess();
      triggerHaptic('success');
    }
  }, [card.error, card.matched]);

  return (
    <Pressable onPressIn={selection.onPressIn} onPressOut={selection.onPressOut}>
      <Animated.View
        style={[
          styles.card,
          entry.animatedStyle,
          selection.animatedStyle,
          shake.animatedStyle,
          success.animatedStyle,
        ]}
      >
        {/* Content */}
      </Animated.View>
    </Pressable>
  );
}
```
