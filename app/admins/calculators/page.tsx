'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  servicesData, 
  priceServicesData, 
  initialIncomeItems, 
  initialExpenseItems 
} from '../../../data/calculators.data';
import "../../styles/calculators/calculators.scss";
import { CostItem } from '@/types/costItem.type';

export default function CalculatorsPage() {
  const [services] = useState(servicesData);
  const [selectedServices, setSelectedServices] = useState<string[]>(['prep']);
  const [totalDays, setTotalDays] = useState(1);
  const [showComplexWarning, setShowComplexWarning] = useState(false);

  const handleServiceToggle = (serviceId: string) => {
    if (serviceId === 'prep') return;
    
    setSelectedServices(prev => {
      const newSelected = prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId];
      
      if (serviceId === 'complex' && !prev.includes('complex')) {
        setShowComplexWarning(true);
        setTimeout(() => setShowComplexWarning(false), 3000);
      }
      
      const total = newSelected.reduce((sum, id) => {
        const service = services.find(s => s.id === id);
        return sum + (service?.baseDays || 0);
      }, 0);
      
      setTotalDays(total);
      return newSelected;
    });
  };
  const [revenue, setRevenue] = useState<number>(100000);
  const [costs, setCosts] = useState<number>(60000);
  const [profit, setProfit] = useState<number>(40000);
  const [margin, setMargin] = useState<number>(40);

  const handleRevenueChange = (value: string) => {
    const num = value === '' ? 0 : Number(value);
    setRevenue(num);
    const newProfit = num - costs;
    setProfit(newProfit);
    setMargin(costs > 0 ? Math.round((newProfit / num) * 100) : 0);
  };

  const handleCostsChange = (value: string) => {
    const num = value === '' ? 0 : Number(value);
    setCosts(num);
    const newProfit = revenue - num;
    setProfit(newProfit);
    setMargin(revenue > 0 ? Math.round((newProfit / revenue) * 100) : 0);
  };

  const [selectedPriceServices, setSelectedPriceServices] = useState<string[]>([]);

  const togglePriceService = (serviceId: string) => {
    setSelectedPriceServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const totalPrice = selectedPriceServices.reduce((sum, id) => {
    const service = priceServicesData.find(s => s.id === id);
    return sum + (service?.price || 0);
  }, 0);
  const [incomeItems, setIncomeItems] = useState<CostItem[]>(initialIncomeItems);
  const [expenseItems, setExpenseItems] = useState<CostItem[]>(initialExpenseItems);

  const addIncomeItem = () => {
    const newId = `inc${incomeItems.length + 1}`;
    setIncomeItems([...incomeItems, { id: newId, name: 'Новый доход', value: 0 }]);
  };

  const addExpenseItem = () => {
    const newId = `exp${expenseItems.length + 1}`;
    setExpenseItems([...expenseItems, { id: newId, name: 'Новый расход', value: 0 }]);
  };

  const updateIncomeItem = (id: string, value: number) => {
    setIncomeItems(prev =>
      prev.map(item => (item.id === id ? { ...item, value } : item))
    );
  };

  const updateExpenseItem = (id: string, value: number) => {
    setExpenseItems(prev =>
      prev.map(item => (item.id === id ? { ...item, value } : item))
    );
  };

  const updateIncomeName = (id: string, name: string) => {
    setIncomeItems(prev =>
      prev.map(item => (item.id === id ? { ...item, name } : item))
    );
  };

  const updateExpenseName = (id: string, name: string) => {
    setExpenseItems(prev =>
      prev.map(item => (item.id === id ? { ...item, name } : item))
    );
  };

  const deleteIncomeItem = (id: string) => {
    if (incomeItems.length > 1) {
      setIncomeItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const deleteExpenseItem = (id: string) => {
    if (expenseItems.length > 1) {
      setExpenseItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const totalIncome = incomeItems.reduce((sum, item) => sum + item.value, 0);
  const totalExpense = expenseItems.reduce((sum, item) => sum + item.value, 0);
  const netProfit = totalIncome - totalExpense;
  const profitColor = netProfit >= 0 ? '#ccff00' : '#ff6b6b';

  return (
    <div className="calculators">
      <div className="calculators__header">
        <h1>Калькуляторы</h1>
        <p>Рассчитайте сроки, стоимость, рентабельность и прибыль</p>
      </div>

      <div className="calculators__grid">
        <motion.div 
          className="calculator-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="calculator-card__title">Сроки разработки</h2>
          
          <div className="services-list">
            {services.map((service) => {
              const isSelected = selectedServices.includes(service.id);
              const isAlways = service.id === 'prep';
              
              return (
                <div 
                  key={service.id}
                  className={`service-item ${isSelected ? 'service-item--selected' : ''} ${isAlways ? 'service-item--always' : ''}`}
                  onClick={() => handleServiceToggle(service.id)}
                >
                  <div className="service-item__checkbox">
                    {isSelected ? '✓' : ''}
                  </div>
                  <div className="service-item__info">
                    <div className="service-item__name">
                      {service.name}
                      {service.id === 'complex' && (
                        <span className="service-item__badge">По договоренности</span>
                      )}
                    </div>
                    <div className="service-item__description">{service.description}</div>
                    <div className="service-item__days">
                      {service.baseDays} {service.baseDays === 1 ? 'день' : service.baseDays < 5 ? 'дня' : 'дней'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <AnimatePresence>
            {showComplexWarning && (
              <motion.div 
                className="calculator-card__warning"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                ⚠️ Сложный сайт требует отдельного обсуждения
              </motion.div>
            )}
          </AnimatePresence>

          <div className="calculator-card__result">
            <span className="calculator-card__result-label">Примерный срок:</span>
            <span className="calculator-card__result-value">{totalDays} дней</span>
          </div>
        </motion.div>

        <motion.div 
          className="calculator-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="calculator-card__title">Рентабельность</h2>
          
          <div className="input-group">
            <label className="input-group__label">Выручка (₽)</label>
            <input 
              type="number" 
              className="input-group__field"
              value={revenue === 0 ? '' : revenue}
              onChange={(e) => handleRevenueChange(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-group__label">Расходы (₽)</label>
            <input 
              type="number" 
              className="input-group__field"
              value={costs === 0 ? '' : costs}
              onChange={(e) => handleCostsChange(e.target.value)}
            />
          </div>

          <div className="profit-block">
            <div className="profit-block__item">
              <span>Прибыль:</span>
              <span className="profit-block__value">{profit.toLocaleString()} ₽</span>
            </div>
            <div className="profit-block__item">
              <span>Рентабельность:</span>
              <span className="profit-block__value profit-block__value--margin">{margin}%</span>
            </div>
          </div>

          <div className="margin-scale">
            <div 
              className="margin-scale__fill" 
              style={{ 
                width: `${Math.min(margin, 100)}%`,
                backgroundColor: margin >= 0 ? '#ccff00' : '#ff6b6b'
              }}
            />
          </div>
        </motion.div>

        <motion.div 
          className="calculator-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="calculator-card__title">Стоимость услуг</h2>
          
          <div className="price-services">
            {priceServicesData.map((service) => (
              <div key={service.id} 
              className={`price-service ${selectedPriceServices.includes(service.id) ? 'price-service__selected' : ''}`}>
                <label className="price-service__label">
                  <input 
                    type="checkbox" 
                    className="price-service__checkbox"
                    checked={selectedPriceServices.includes(service.id)}
                    onChange={() => togglePriceService(service.id)}
                  />
                  {service.name}
                </label>
                <span className="price-service__value">
                  от {service.price.toLocaleString()} {service.unit}
                </span>
              </div>
            ))}
          </div>

          <div className="calculator-card__result">
            <span className="calculator-card__result-label">Примерная стоимость:</span>
            <span className="calculator-card__result-value">
              от {totalPrice.toLocaleString()} ₽
            </span>
          </div>
          <div className="calculator-card__note">
            * Точная цена обсуждается индивидуально
          </div>
        </motion.div>

        <motion.div 
          className="calculator-card calculator-card--full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="calculator-card__title">Прибыль и убытки</h2>
          
          <div className="dual-columns">
            <div className="column">
              <div className="column__header">
                <h3>Доходы</h3>
                <button className="column__add-btn" onClick={addIncomeItem}>+</button>
              </div>
              {incomeItems.map((item) => (
                <div key={item.id} className="cost-item">
                  <input 
                    type="text" 
                    className="cost-item__name"
                    value={item.name} 
                    onChange={(e) => updateIncomeName(item.id, e.target.value)}
                    placeholder="Название"
                  />
                  <input 
                    type="number" 
                    className="cost-item__value"
                    value={item.value === 0 ? '' : item.value}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : Number(e.target.value);
                      updateIncomeItem(item.id, val);
                    }}
                    placeholder="Сумма"
                  />
                  <button className="cost-item__remove" onClick={() => deleteIncomeItem(item.id)}>×</button>
                </div>
              ))}
              <div className="column__total">
                <span className="column__total-label">Итого доходов:</span>
                <span className="column__total-value">{totalIncome.toLocaleString()} ₽</span>
              </div>
            </div>

            <div className="column">
              <div className="column__header">
                <h3>Расходы</h3>
                <button className="column__add-btn" onClick={addExpenseItem}>+</button>
              </div>
              {expenseItems.map((item) => (
                <div key={item.id} className="cost-item">
                  <input 
                    type="text" 
                    className="cost-item__name"
                    value={item.name} 
                    onChange={(e) => updateExpenseName(item.id, e.target.value)}
                    placeholder="Название"
                  />
                  <input 
                    type="number" 
                    className="cost-item__value"
                    value={item.value === 0 ? '' : item.value}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : Number(e.target.value);
                      updateExpenseItem(item.id, val);
                    }}
                    placeholder="Сумма"
                  />
                  <button className="cost-item__remove" onClick={() => deleteExpenseItem(item.id)}>×</button>
                </div>
              ))}
              <div className="column__total">
                <span className="column__total-label">Итого расходов:</span>
                <span className="column__total-value">{totalExpense.toLocaleString()} ₽</span>
              </div>
            </div>
          </div>

          <div className="net-profit" style={{ borderColor: profitColor }}>
            <span className="net-profit__label">Чистая прибыль:</span>
            <span className="net-profit__value" style={{ color: profitColor }}>
              {netProfit.toLocaleString()} ₽
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}