interface UseVictoryModalViewModelProps {
  timeElapsed: number;
  rankingPosition?: number;
}

export function useVictoryModalViewModel({ timeElapsed, rankingPosition }: UseVictoryModalViewModelProps) {
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;
  const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const getPositionSuffix = (position: number) => {
    return 'º';
  };

  return {
    timeString,
    getPositionSuffix,
  };
}
