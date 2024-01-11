import React from 'react';
import { render, act } from '@testing-library/react';
import Index from '../pages/index';

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('Index', () => {
  it('should render successfully', async () => {
    const props =  {
      mdlJson: {"catalog":"canner-cml","schema":"tpch_tiny","models":[{"name":"Orders","refSql":"select * from \"canner-cml\".tpch_tiny.orders","columns":[{"name":"orderkey","expression":"o_orderkey","type":"integer"},{"name":"custkey","expression":"o_custkey","type":"integer"},{"name":"orderstatus","expression":"o_orderstatus","type":"string"},{"name":"totalprice","expression":"o_totalprice","type":"float"},{"name":"customer","type":"Customer","relationship":"OrdersCustomer"},{"name":"orderdate","expression":"o_orderdate","type":"date"}],"primaryKey":"orderkey"},{"name":"Customer","refSql":"select * from \"canner-cml\".tpch_tiny.customer","columns":[{"name":"custkey","expression":"c_custkey","type":"integer"},{"name":"name","expression":"c_name","type":"string"},{"name":"orders","type":"Orders","relationship":"OrdersCustomer"}],"primaryKey":"custkey"}],"relationships":[{"name":"OrdersCustomer","models":["Orders","Customer"],"joinType":"MANY_TO_ONE","condition":"Orders.custkey = Customer.custkey"}],"metrics":[{"name":"Revenue","baseModel":"Orders","dimension":[{"name":"custkey","type":"integer"}],"measure":[{"name":"totalprice","type":"integer","expression":"sum(totalprice)"}],"timeGrain":[{"name":"orderdate","refColumn":"orderdate","dateParts":["YEAR","MONTH"]}],"preAggregated":true,"refreshTime":"2m"}]},
      connections: {
        database: 'tpch',
        port: '5432',
        username: 'canner-cml',
        password: 'canner-cml',
      }
    }

    await act(() => {
      const { baseElement } = render(<Index {...props} />);
      expect(baseElement).toBeTruthy();
    })
  });
});
