import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StocklistContainer = styled.div`
  padding: 16px;
`;

interface Stock {
  id: number;
  name: string;
  ticker: string;
}

interface StockListProps {
  stocks: Stock[];
}

class StockList extends Component<StockListProps> {
  render() {
    const { stocks } = this.props;
    return (
      <StocklistContainer>
        {stocks.map(stock => (
          <div key={stock.id}>
            <Link to={`/stock/${stock.id}`}>
              {stock.name} ({stock.ticker})
            </Link>
          </div>
        ))}
      </StocklistContainer>
    );
  }
}

export default StockList;