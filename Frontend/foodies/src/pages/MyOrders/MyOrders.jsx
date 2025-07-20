import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../components/context/StoreContext';
import Parcel from '../../assets/parcel.png';
import axios from 'axios';
import './MyOrders.css'; // Add this line to use the styles below

const MyOrders = () => {
  const { token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    const response = await axios.get('http://localhost:8080/api/orders', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setData(response.data);
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders-wrapper">
      <h2 className="my-orders-title">My Orders</h2>
      <div className="orders-table">
        {data.map((order, index) => (
          <div className="order-row" key={index}>
            <div className="order-col.parcel">
              <img src={Parcel} alt="parcel" height={48} width={48}/>
            </div>
            <div className="order-col items">
              {order.orderedItems.map((item, idx) => (
                <span key={idx}>
                  {item.name} × {item.quantity}
                  {idx !== order.orderedItems.length - 1 && ', '}
                </span>
              ))}
            </div>
            <div className="order-col amount">₹{order.amount.toFixed(2)}</div>
            <div className="order-col count">Items: {order.orderedItems.length}</div>
            <div className={`order-col status ${order.orderStatus.toLowerCase()}`}>
              ● {order.orderStatus}
            </div>
            <div className="order-col refresh">
              <button onClick={fetchOrders} title="Refresh Order">
                ↻
              </button>
            </div>
          </div>
        ))}
        {data.length === 0 && <div className="no-orders">No orders yet.</div>}
      </div>
    </div>
  );
};

export default MyOrders;
