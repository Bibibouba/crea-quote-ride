
import React from 'react';
import QuoteFormContainer from './form/QuoteFormContainer';

interface QuoteFormProps {
  clientId?: string;
  onSuccess?: () => void;
  showDashboardLink?: boolean;
}

const QuoteForm: React.FC<QuoteFormProps> = (props) => {
  return <QuoteFormContainer {...props} />;
};

export default QuoteForm;
