import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaTrash, FaSave, FaPlus, FaTimes } from 'react-icons/fa';

const CatNames = () => {
  const [catNames, setCatNames] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  const [editCatName, setEditCatName] = useState(null);
  const [editValue, setEditValue] = useState('');

  const fetchCatNames = async () => {
    try {
      const response = await axios.post('https://lubosoftdev.com/api/nst_back_end_code/catagory.php?run=get_all_main_cat', {
        deviceType: 'web',
        username: 'anvar'
      });
      if (response.data.status === 'success') {
        setCatNames(response.data.message);
      }
      console.log('get api resonse',response.data.message);
    } catch (error) {
      console.error('Error fetching cat names:', error);
    }
  };

  useEffect(() => {
    fetchCatNames();
  }, []);

  const addCatName = async () => {
    try {
    const res =  await axios.post('https://lubosoftdev.com/api/nst_back_end_code/catagory.php?run=insert_main_catagory', {
        deviceType: 'web',
        username: 'anvar',
        cat_name: newCatName
      });
        console.log('add cat name',res);
      fetchCatNames();
      setNewCatName('');
    
    } catch (error) {
      console.error('Error adding cat name:', error);
    }
  };

  const updateCatName = async (id) => {
    try {
    const res =  await axios.post('https://lubosoftdev.com/api/nst_back_end_code/catagory.php?run=update_main_catagory', {
        deviceType: 'web',
        username: 'anvar',
        cat_name: editValue,
        main_cat_id: id,
        deleted_flg: 'U'
      });
        console.log('update cat name',res);
      fetchCatNames();
      setEditCatName(null);
      setEditValue('');
    } catch (error) {
      console.error('Error updating cat name:', error);
    }
  };

  const deleteCatName = async (id, catName) => {
    try {
     const res = await axios.post('https://lubosoftdev.com/api/nst_back_end_code/catagory.php?run=update_main_catagory', {
        deviceType: 'web',
        username: 'anvar',
        cat_name: catName,
        main_cat_id: id,
        deleted_flg: 'D'
      });
        console.log('delete cat name',res);
      setCatNames(catNames.filter(cat => cat.MAIN_CAT_ID !== id));
    } catch (error) {
      console.error('Error deleting cat name:', error);
    }
  };

  const handleEdit = (cat) => {
    setEditCatName(cat.MAIN_CAT_ID);
    setEditValue(cat.MAIN_CAT_NAME);
  };

  const handleCancelEdit = () => {
    setEditCatName(null);
    setEditValue('');
  };

  const handleSave = () => {
    updateCatName(editCatName);
  };

  return (
    <div style={{ padding: '20px',fontFamily:'monospace' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Cat Names Manager</h1>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          value={editCatName ? editValue : newCatName}
          onChange={(e) => editCatName ? setEditValue(e.target.value) : setNewCatName(e.target.value)}
          placeholder="Add a new cat name"
          style={{ padding: '10px', fontSize: '16px', marginRight: '10px',
            borderRadius:5,
            border:'1px solid #ccc',
            boxShadow: '0 2px 2px rgba(0, 0, 0, 0.1)',
            width:'70%',
            outline:'none'

            }}
        />
        <button onClick={editCatName ? handleSave : addCatName} style={{ padding: '10px', fontSize: '16px',
            borderRadius:5,
            border:'1px solid #ccc',
            boxShadow: '0 2px 2px rgba(0, 0, 0, 0.1)',
            outline:'none'
         }}>
          {editCatName ? <FaSave /> : <FaPlus />}
        </button>
        {editCatName && (
          <button onClick={handleCancelEdit} style={{ padding: '10px', fontSize: '16px', marginLeft: '10px',
            borderRadius:5,
            border:'1px solid #ccc',
            boxShadow: '0 2px 2px rgba(0, 0, 0, 0.1)',
            outline:'none'
           }}>
            <FaTimes />
          </button>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <motion.div layout style={{ width: '70%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #ccc', backgroundColor: '#e3f2fd',marginBottom:10,borderRadius:5 }}>
            <strong>Cat Name</strong>
            <strong>Actions</strong>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <AnimatePresence>
              {catNames.map((cat) => (
                <motion.li
                  key={cat.MAIN_CAT_ID}
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px',
                  
                    backgroundColor: '#fff',
                    marginBottom: '10px',
                    borderRadius: '10px',
                    transition: 'background-color 0.3s ease',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                  }}
                  whileHover={{ backgroundColor: '#e3f2fd' }}
                >
                  <span>{cat.MAIN_CAT_NAME}</span>
                  <div>
                    <FaEdit
                      style={{ cursor: 'pointer', marginRight: '10px' }}
                      onClick={() => handleEdit(cat)}
                    />
                    <FaTrash
                      style={{ cursor: 'pointer' }}
                      onClick={() => deleteCatName(cat.MAIN_CAT_ID, cat.MAIN_CAT_NAME)}
                    />
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default CatNames;
