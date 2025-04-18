
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.11'
import * as React from 'npm:react@18.2.0'

interface QuoteEmailProps {
  clientName: string;
  quoteId: string;
  departureLocation: string;
  arrivalLocation: string;
  rideDate: string;
  amount: number;
  pdfUrl?: string;
}

export const QuoteEmail = ({
  clientName,
  quoteId,
  departureLocation,
  arrivalLocation,
  rideDate,
  amount,
  pdfUrl,
}: QuoteEmailProps) => (
  <Html>
    <Head />
    <Preview>Votre devis de transport VTC</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Votre devis VTC est disponible</Heading>
        
        <Text style={text}>Bonjour {clientName},</Text>
        
        <Text style={text}>
          Nous vous remercions d'avoir utilisé notre service. Votre devis N° {quoteId} a été généré avec succès.
        </Text>
        
        <Section style={detailsSection}>
          <Text style={detailTitle}>Détails du trajet :</Text>
          <Text style={detail}>Départ : {departureLocation}</Text>
          <Text style={detail}>Arrivée : {arrivalLocation}</Text>
          <Text style={detail}>Date : {rideDate}</Text>
          <Text style={detail}>Montant total : {amount.toFixed(2)}€</Text>
        </Section>

        {pdfUrl && (
          <Section style={buttonContainer}>
            <Link href={pdfUrl} style={button}>
              Télécharger le devis PDF
            </Link>
          </Section>
        )}
        
        <Text style={text}>
          Ce devis est valable 7 jours à compter de sa date d'émission. Pour toute question, n'hésitez pas à nous contacter.
        </Text>
        
        <Text style={footer}>
          Cordialement,<br />
          L'équipe VTC
        </Text>
      </Container>
    </Body>
  </Html>
)

export default QuoteEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.25',
  marginBottom: '24px',
  textAlign: 'center' as const,
}

const text = {
  color: '#1f2937',
  fontSize: '16px',
  lineHeight: '24px',
  marginBottom: '20px',
}

const detailsSection = {
  margin: '16px 0',
  padding: '24px',
  backgroundColor: '#f8fafc',
  borderRadius: '6px',
}

const detailTitle = {
  ...text,
  fontWeight: '600',
  marginBottom: '12px',
}

const detail = {
  ...text,
  marginBottom: '8px',
}

const buttonContainer = {
  textAlign: 'center' as const,
  marginTop: '32px',
}

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  marginTop: '16px',
}

const footer = {
  ...text,
  color: '#6b7280',
  marginTop: '32px',
}
