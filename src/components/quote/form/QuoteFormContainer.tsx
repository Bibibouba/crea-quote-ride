
import React from 'react';
import QuoteStateContainer from './QuoteStateContainer';

interface QuoteFormContainerProps {
  clientId?: string;
  onSuccess?: () => void;
  showDashboardLink?: boolean;
}

const QuoteFormContainer: React.FC<QuoteFormContainerProps> = ({ 
  clientId, 
  onSuccess, 
  showDashboardLink = true 
}) => {
  return (
    <QuoteStateContainer 
      clientId={clientId}
      onSuccess={onSuccess}
      showDashboardLink={showDashboardLink}
    />
  );
};

export default QuoteFormContainer;
