import { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { ConfettiPiece } from './ConfettiPiece';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CONFETTI_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#FFE66D',
  '#95E1D3',
  '#F38181',
  '#AA96DA',
  '#FCBAD3',
  '#A8D8EA',
  '#55EAE1',
  '#7DAFFF',
  '#C27CFB',
  '#32D74B',
];

const SHAPES: ('square' | 'rectangle' | 'circle')[] = ['square', 'rectangle', 'circle'];

interface ConfettiEffectProps {
  active: boolean;
  burstCount?: number;
  continuousCount?: number;
  continuousInterval?: number;
}

interface ConfettiConfig {
  id: number;
  color: string;
  startX: number;
  delay: number;
  duration: number;
  size: number;
  shape: 'square' | 'rectangle' | 'circle';
  swingDirection: number;
  swingAmount: number;
  rotationSpeed: number;
  createdAt: number;
}

const createConfettiPiece = (id: number, isBurst: boolean): ConfettiConfig => {
  const swingDirection = id % 2 === 0 ? 1 : -1;
  return {
    id,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    startX: Math.random() * SCREEN_WIDTH,
    delay: isBurst ? Math.random() * 400 : 0,
    duration: isBurst ? 3500 + Math.random() * 1000 : 4500 + Math.random() * 1500,
    size: 8 + Math.random() * 6,
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    swingDirection,
    swingAmount: 25 + Math.random() * 35,
    rotationSpeed: 2 + Math.random() * 2,
    createdAt: Date.now(),
  };
};

export function ConfettiEffect({
  active,
  burstCount = 40,
  continuousCount = 2,
  continuousInterval = 500,
}: ConfettiEffectProps) {
  const [pieces, setPieces] = useState<ConfettiConfig[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cleanupRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const idCounterRef = useRef(0);

  const cleanup = useCallback(() => {
    const now = Date.now();
    const maxLifetime = 6000;
    setPieces((prev) => prev.filter((p) => now - p.createdAt < maxLifetime));
  }, []);

  useEffect(() => {
    if (active) {
      idCounterRef.current = 0;

      const burstPieces: ConfettiConfig[] = Array.from(
        { length: burstCount },
        () => {
          idCounterRef.current += 1;
          return createConfettiPiece(idCounterRef.current, true);
        }
      );
      setPieces(burstPieces);

      intervalRef.current = setInterval(() => {
        const newPieces: ConfettiConfig[] = Array.from(
          { length: continuousCount },
          () => {
            idCounterRef.current += 1;
            return createConfettiPiece(idCounterRef.current, false);
          }
        );
        setPieces((prev) => [...prev, ...newPieces]);
      }, continuousInterval);

      cleanupRef.current = setInterval(cleanup, 2000);
    } else {
      setPieces([]);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (cleanupRef.current) {
        clearInterval(cleanupRef.current);
        cleanupRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (cleanupRef.current) clearInterval(cleanupRef.current);
    };
  }, [active, burstCount, continuousCount, continuousInterval, cleanup]);

  if (!active && pieces.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {pieces.map((piece) => (
        <ConfettiPiece
          key={piece.id}
          color={piece.color}
          startX={piece.startX}
          delay={piece.delay}
          duration={piece.duration}
          size={piece.size}
          shape={piece.shape}
          swingDirection={piece.swingDirection}
          swingAmount={piece.swingAmount}
          rotationSpeed={piece.rotationSpeed}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 1000,
  },
});
