import React, { useState, useContext, useRef } from 'react'
import { GlobalContext } from '../context/GlobalState';

export const AddTransaction = () => {
    const [text, setText] = useState('');
    const [amount, setAmount] = useState(0);
    const [category, setCategory] = useState('');
    const counterRef = useRef(0);
    const { addTransaction } = useContext(GlobalContext);


    const onSubmit = e => {
        e.preventDefault();
        const newTransaction = {
            text,
            amount: +amount,
            category,
        }

        addTransaction(newTransaction);
        setText('');
        setAmount(0);
        setCategory("Select")
    }   

    const spendingCategoriesData = [
      { id: '1', label: 'Groceries' },
      { id: '2', label: 'Alcohol & Tobacco' },
      { id: '3', label: 'Fashion' },
      { id: '4', label: 'Household' },
      { id: '5', label: 'Health' },
      { id: '6', label: 'Transport' },
      { id: '7', label: 'Recreation' },
      { id: '8', label: 'Outside Food' },
      { id: '9', label: 'Miscellaneous' },
      { id: '10', label: 'Income'}
    ];

    return (
        <div className="mb-4 form-control">
            <label className="block text-gray-700 font-bold mb-2">Add new transaction</label>
            <form onSubmit={onSubmit}>
              <div className="mb-4">
                <label htmlFor="text" className="block text-gray-700 font-bold mb-2">Text</label>
                <input 
                  type="text" 
                  id="text" 
                  value={text} 
                  onChange={(e) => setText(e.target.value)} 
                  required 
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                  placeholder="Enter text..."
                />
              </div>

              <div className="mb-4 form-control">
                <label htmlFor="amount" className="block text-gray-700 font-bold mb-2">
                  Amount <br />(negative - expense, positive - income)
                </label>
                <input 
                  type="number" 
                  id="amount" 
                  value={amount} 
                  onChange={(e) => {setAmount(e.target.value);
                    if (+e.target.value <= 0) {
                      setCategory(prevCategory => prevCategory === 'Income' ? '' : prevCategory);
                    }
                  }}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                  placeholder="Enter amount..."
                />
              </div>

              <div className="mb-4 form-control">
                  <label htmlFor="spendingCategory" className="block text-gray-700 font-bold mb-2">Category:</label>
                  <select 
                    id="spendingCategory" 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="">Select a category...</option>
                    {spendingCategoriesData.map(category => (
                      <option key={category.id} value={category.label} disabled={category.label === 'Income' ? +amount <= 0 : +amount > 0}>{category.label}</option>
                    ))}
                  </select>
              </div>

              <div className="flex justify-center">
                <input 
                  type="submit" 
                  value="Add Transaction" 
                  className="button-class hover:bg-gray-600" 
                />
              </div>
            </form>
        </div>
    )
}