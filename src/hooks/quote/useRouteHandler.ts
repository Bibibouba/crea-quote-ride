
interface UseRouteHandlerProps {
  routeHandler: (distance: number, duration: number) => {
    oneWayDistance: number;
    oneWayDuration: number;
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
    const { oneWayDistance, oneWayDuration } = routeHandler(distance, duration);
    setEstimatedDistance(oneWayDistance);
    setEstimatedDuration(oneWayDuration);
  };
  
  return {
    handleRouteCalculated
  };
};
