export const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '20px' },
  headerRow: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '25px', 
    flexWrap: 'wrap', 
    gap: '15px' 
  },
  searchBar: { 
    display: 'flex', 
    gap: '12px', 
    alignItems: 'center', 
    flexWrap: 'wrap' 
  },
  input: { 
    padding: '10px 14px', 
    border: '2px solid #ced4da', 
    borderRadius: '8px', 
    fontSize: '1rem', 
    minWidth: '250px' 
  },
  select: { 
    padding: '10px 14px', 
    border: '2px solid #ced4da', 
    borderRadius: '8px', 
    fontSize: '1rem' 
  },
  button: { 
    padding: '10px 20px', 
    border: 'none', 
    borderRadius: '8px', 
    fontWeight: '600', 
    cursor: 'pointer', 
    color: 'white' 
  },
  btnSuccess: { backgroundColor: '#28a745' },
  btnPrimary: { backgroundColor: '#007bff' },  // ← Добавил
  btnDanger: { backgroundColor: '#dc3545' },
  table: { 
    width: '100%', 
    borderCollapse: 'separate', 
    borderSpacing: '0', 
    background: 'white', 
    borderRadius: '10px', 
    overflow: 'hidden', 
    boxShadow: '0 5px 20px rgba(0,0,0,0.1)' 
  },
  th: { 
    backgroundColor: '#212529', 
    color: 'white', 
    padding: '16px', 
    textAlign: 'left' 
  },
  td: { 
    padding: '14px 16px', 
    borderBottom: '1px solid #dee2e6' 
  },
  modalOverlay: { 
    position: 'fixed', 
    inset: 0, 
    background: 'rgba(0,0,0,0.6)', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 1000 
  },
  modal: { 
    background: 'white', 
    padding: '30px', 
    borderRadius: '12px', 
    width: '90%', 
    maxWidth: '600px', 
    maxHeight: '90vh', 
    overflowY: 'auto', 
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)' 
  },
  formGroup: { marginBottom: '16px' },
  label: { display: 'block', marginBottom: '6px', fontWeight: '600' }
};