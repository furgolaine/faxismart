// Testes de componentes para o frontend do Faxismart

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import PriceDetailsComponent from '../src/components/PriceDetailsComponent';
import ReferralSystemComponent from '../src/components/ReferralSystemComponent';

// Mock do Redux store
const mockStore = configureStore([]);

describe('Componentes do Sistema Financeiro - Testes', () => {
  describe('PriceDetailsComponent', () => {
    const mockPriceDetails = {
      pricing: {
        squareMeters: 80,
        pricePerSquareMeter: 1.5,
        complexityLevel: 2,
        complexityMultiplier: 1.1,
        basePrice: 120,
        hasDiscount: true,
        discountAmount: 12,
        totalPrice: 108
      },
      distribution: {
        platformFeePercentage: 10,
        platformFee: 10.8,
        hasReferral: true,
        referralFeePercentage: 5,
        referralFee: 5.4,
        professionalAmount: 91.8,
        professionalPercentage: 85
      }
    };

    test('Deve renderizar corretamente os detalhes de preço', () => {
      render(<PriceDetailsComponent priceDetails={mockPriceDetails} />);
      
      // Verificar se os elementos principais estão presentes
      expect(screen.getByText('Detalhes do Preço')).toBeInTheDocument();
      expect(screen.getByText('Metragem:')).toBeInTheDocument();
      expect(screen.getByText('80 m²')).toBeInTheDocument();
      expect(screen.getByText('Preço Total:')).toBeInTheDocument();
      expect(screen.getByText('R$ 108,00')).toBeInTheDocument();
    });

    test('Deve exibir informações de desconto quando aplicável', () => {
      render(<PriceDetailsComponent priceDetails={mockPriceDetails} />);
      
      expect(screen.getByText('Desconto (10%):')).toBeInTheDocument();
      expect(screen.getByText('-R$ 12,00')).toBeInTheDocument();
    });

    test('Deve exibir distribuição de valores quando solicitado', () => {
      render(<PriceDetailsComponent priceDetails={mockPriceDetails} showDistribution={true} />);
      
      expect(screen.getByText('Distribuição de Valores')).toBeInTheDocument();
      expect(screen.getByText('Taxa da plataforma (10%):')).toBeInTheDocument();
      expect(screen.getByText('R$ 10,80')).toBeInTheDocument();
      expect(screen.getByText('Taxa de indicação (5%):')).toBeInTheDocument();
      expect(screen.getByText('R$ 5,40')).toBeInTheDocument();
      expect(screen.getByText('Valor para o profissional (85%):')).toBeInTheDocument();
      expect(screen.getByText('R$ 91,80')).toBeInTheDocument();
    });

    test('Não deve exibir distribuição de valores quando não solicitado', () => {
      render(<PriceDetailsComponent priceDetails={mockPriceDetails} showDistribution={false} />);
      
      expect(screen.queryByText('Distribuição de Valores')).not.toBeInTheDocument();
    });
  });

  describe('ReferralSystemComponent', () => {
    const store = mockStore({
      auth: {
        user: {
          id: '123',
          role: 'professional'
        }
      }
    });

    test('Deve renderizar corretamente para profissionais', async () => {
      render(
        <Provider store={store}>
          <ReferralSystemComponent 
            userId="123" 
            userType="professional" 
          />
        </Provider>
      );
      
      // Aguardar carregamento dos dados
      await waitFor(() => {
        expect(screen.getByText('Sistema de Indicação')).toBeInTheDocument();
        expect(screen.getByText(/Indique amigos para se tornarem profissionais/)).toBeInTheDocument();
      });
    });

    test('Deve exibir código de referência quando disponível', async () => {
      render(
        <Provider store={store}>
          <ReferralSystemComponent 
            userId="123" 
            userType="professional" 
          />
        </Provider>
      );
      
      // Aguardar carregamento dos dados
      await waitFor(() => {
        expect(screen.getByText('Seu código de indicação:')).toBeInTheDocument();
        expect(screen.getByText('Compartilhar')).toBeInTheDocument();
      });
    });

    test('Deve exibir estatísticas de referência quando disponíveis', async () => {
      render(
        <Provider store={store}>
          <ReferralSystemComponent 
            userId="123" 
            userType="professional" 
          />
        </Provider>
      );
      
      // Aguardar carregamento dos dados
      await waitFor(() => {
        expect(screen.getByText('Suas Indicações')).toBeInTheDocument();
        expect(screen.getByText('Total')).toBeInTheDocument();
        expect(screen.getByText('Ativos')).toBeInTheDocument();
        expect(screen.getByText('Ganhos')).toBeInTheDocument();
      });
    });
  });
});
