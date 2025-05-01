
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const WidgetSettings = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [widgetUrl, setWidgetUrl] = useState('');
  const [embedCode, setEmbedCode] = useState('');
  
  useEffect(() => {
    if (user?.id) {
      // Utiliser l'URL absolue du site déployé au lieu de window.location.origin
      // En production, l'URL sera celle du domaine déployé
      const baseUrl = window.location.href.split('/dashboard')[0];
      const widgetPath = `/widget/${user.id}`;
      setWidgetUrl(`${baseUrl}${widgetPath}`);
      
      const code = `<iframe 
  src="${baseUrl}${widgetPath}" 
  width="100%" 
  height="700" 
  style="border:none;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.1);" 
  title="Simulateur de devis VTC" 
  allowfullscreen
></iframe>`;
      
      setEmbedCode(code);
    }
  }, [user]);

  const handleCopy = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(message);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleOpenWidgetDemo = () => {
    if (widgetUrl) {
      // Ouvrir l'URL complète du widget dans un nouvel onglet
      window.open(widgetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Widget pour votre site web</CardTitle>
        <CardDescription>
          Intégrez facilement le simulateur de devis sur votre site web
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="embed" className="space-y-4">
          <TabsList>
            <TabsTrigger value="embed">Code d'intégration</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="docs">Documentation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="embed" className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="widget-url">URL du widget</Label>
              <div className="flex">
                <Input
                  id="widget-url"
                  readOnly
                  value={widgetUrl}
                  className="flex-1 font-mono text-xs sm:text-sm"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  className="ml-2 whitespace-nowrap"
                  onClick={() => handleCopy(widgetUrl, 'URL copiée dans le presse-papier')}
                >
                  {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  Copier
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Vous pouvez partager cette URL directement ou l'intégrer dans une iframe sur votre site.
              </p>
            </div>
            
            <div className="flex flex-col space-y-2 mt-4">
              <Label htmlFor="embed-code">Code d'intégration pour votre site</Label>
              <Textarea
                id="embed-code"
                readOnly
                value={embedCode}
                rows={6}
                className="font-mono text-xs sm:text-sm"
              />
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => handleCopy(embedCode, 'Code d\'intégration copié dans le presse-papier')}
                  className="flex-1"
                >
                  {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  Copier le code
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleOpenWidgetDemo}
                  className="flex-1"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Tester le widget
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="config" className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm">
                La configuration du widget utilise les paramètres de votre entreprise que vous avez définis dans l'onglet "Configuration de l'entreprise".
                Modifiez les couleurs, le logo et autres paramètres dans cette section pour personnaliser l'apparence de votre widget.
              </p>
              
              <div className="mt-4 flex flex-col gap-2">
                <Button variant="outline" asChild>
                  <Link to="/dashboard/settings?tab=company">
                    Modifier les paramètres d'entreprise
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="docs" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Guide d'intégration</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Comment intégrer le widget sur votre site web
                </p>
                
                <div className="mt-3 space-y-3">
                  <div className="space-y-1">
                    <h4 className="text-md font-medium">1. Copiez le code d'intégration</h4>
                    <p className="text-sm">
                      Utilisez le code d'intégration fourni dans l'onglet "Code d'intégration".
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-md font-medium">2. Collez le code dans votre site</h4>
                    <p className="text-sm">
                      Insérez le code HTML à l'endroit où vous souhaitez afficher le widget dans le code de votre site.
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-md font-medium">3. Personnalisez les dimensions</h4>
                    <p className="text-sm">
                      Vous pouvez modifier les attributs width et height de l'iframe selon vos besoins.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold">Bonnes pratiques</h3>
                <ul className="list-disc list-inside space-y-2 mt-2 text-sm">
                  <li>Placez le widget dans une section visible de votre site</li>
                  <li>Assurez-vous que la largeur est suffisante pour afficher correctement le contenu (minimum recommandé: 340px)</li>
                  <li>La hauteur recommandée est de 700px pour éviter les défilements excessifs</li>
                  <li>Testez le widget sur différents appareils pour vérifier la réactivité</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WidgetSettings;
