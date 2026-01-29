interface UseGameHeaderViewModelProps {
  timeRemaining: number;
}

export function useGameHeaderViewModel({ timeRemaining }: UseGameHeaderViewModelProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isLowTime = timeRemaining <= 30;

  return {
    timeString,
    isLowTime,
  };
}
