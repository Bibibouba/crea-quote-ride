
interface UseRouteHandlerProps {
  routeHandler: (distance: number, duration: number) => {
    estimatedDistance: number;
    estimatedDuration: number;
  };
  setEstimatedDistance: (distance: number) => void;
  setEstimatedDuration: (duration: number) => void;
}

export const useRouteHandler = ({
  routeHandler,
  setEstimatedDistance,
  setEstimatedDuration
}: UseRouteHandlerProps) => {
  const handleRouteCalculated = (distance: number, duration: number) => {
    const { estimatedDistance: newDistance, estimatedDuration: newDuration } = routeHandler(distance, duration);
    setEstimatedDistance(newDistance);
    setEstimatedDuration(newDuration);
  };
  
  return {
    handleRouteCalculated
  };
};
