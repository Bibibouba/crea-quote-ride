
import React from 'react';
import { Link } from 'react-router-dom';

const SignupPrompt = () => {
  return (
    <div className="text-sm text-muted-foreground">
      Nouveau sur VTCZen?{' '}
      <Link to="/inscription" className="text-primary hover:underline">
        Créer un compte
      </Link>
    </div>
  );
};

export default SignupPrompt;
