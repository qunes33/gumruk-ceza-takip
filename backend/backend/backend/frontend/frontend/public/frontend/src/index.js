import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  const [cezalar, setCezalar] = useState([]);
  const [formData, setFormData] = useState({
    beyanname_no: '',
    plaka_no: '',
    ceza_maddesi: '',
    ceza_tutari: '',
    para_birimi: 'TL',
    teblig_tarihi: ''
  });

  const API_URL = "http://127.0.0.1:5000/api";

  // API'den cezaları çekme
  const verileriYukle = async () => {
    try {
      const response = await fetch(`${API_URL}/cezalar`);
      const data = await response.json();
      setCezalar(data);
    } catch (error) {
      console.error("Veri çekilirken hata oluştu:", error);
    }
  };

  useEffect(() => {
    verileriYukle();
  }, []);

  // Form inputları değiştikçe state güncelleme
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Yeni ceza ekleme fonksiyonu
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/ceza/ekle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setFormData({
          beyanname_no: '',
          plaka_no: '',
          ceza_maddesi: '',
          ceza_tutari: '',
          para_birimi: 'TL',
          teblig_tarihi: ''
        });
        verileriYukle();
      } else {
        const errorData = await response.json();
        alert("Hata: " + errorData.hata);
      }
    } catch (error) {
      alert("Sunucuya bağlanılamadı kanka.");
    }
  };

  // Kasa Toplamları Hesaplama (Kur çevrimi kesinlikle yok, kasalar ayrı)
  const toplamTL = cezalar
    .filter(c => c.para_birimi === 'TL')
    .reduce((sum, c) => sum + c.ceza_tutari, 0);

  const toplamUSD = cezalar
    .filter(c => c.para_birimi === 'USD')
    .reduce((sum, c) => sum + c.ceza_tutari, 0);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '30px', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        <h2 style={{ color: '#333', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
          Gümrük Ceza Kararı Takip Sistemi
        </h2>

        {/* Özet Panelleri */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '25px', marginTop: '20px' }}>
          <div style={{ flex: 1, background: '#white', padding: '20px', borderRadius: '8px', borderLeft: '6px solid #28a745', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', backgroundColor: '#fff' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Toplam TL Kasa</h4>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>{toplamTL.toFixed(2)} TL</span>
          </div>
          <div style={{ flex: 1, background: '#white', padding: '20px', borderRadius: '8px', borderLeft: '6px solid #dc3545', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', backgroundColor: '#fff' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Toplam USD Kasa</h4>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>{toplamUSD.toFixed(2)} USD</span>
          </div>
        </div>

        {/* Veri Giriş Formu */}
        <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '25px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#444' }}>Yeni Ceza Girişi</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#555' }}>Beyanname No</label>
              <input type="text" name="beyanname_no" value={formData.beyanname_no} onChange={handleChange} required minLength={16} maxLength={16} style={{ width: '90%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#555' }}>Araç Plakası</label>
              <input type="text" name="plaka_no" value={formData.plaka_no} onChange={handleChange} style={{ width: '90%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#555' }}>Ceza Maddesi</label>
              <input type="text" name="ceza_maddesi" value={formData.ceza_maddesi} onChange={handleChange} required style={{ width: '90%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#555' }}>Tutar</label>
              <input type="number" name="ceza_tutari" value={formData.ceza_tutari} onChange={handleChange} required step="0.01" style={{ width: '90%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#555' }}>Birim</label>
              <select name="para_birimi" value={formData.para_birimi} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff' }}>
                <option value="TL">TL</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#555' }}>Tebliğ Tarihi</label>
              <input type="date" name="teblig_tarihi" value={formData.teblig_tarihi} onChange={handleChange} required style={{ width: '90%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <button type="submit" style={{ padding: '10px', background: '#0056b3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Kaydet</button>
          </form>
        </div>

        {/* Tablo Listesi */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#444' }}>Ceza Kararları Kayıtları</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '12px', textAlign: 'left', color: '#555' }}>Beyanname No</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#555' }}>Plaka</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#555' }}>Ceza Maddesi</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#555' }}>Ceza Tutarı</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#555' }}>Tebliğ Tarihi</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#555' }}>Son İtiraz Tarihi</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#555' }}>Durum</th>
              </tr>
            </thead>
            <tbody>
              {cezalar.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{c.beyanname_no}</td>
                  <td style={{ padding: '12px' }}>{c.plaka_no || '-'}</td>
                  <td style={{ padding: '12px' }}><span style={{ background: '#e9ecef', padding: '3px 8px', borderRadius: '4px', fontSize: '13px' }}>{c.ceza_maddesi}</span></td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{c.ceza_tutari.toFixed(2)} {c.para_birimi}</td>
                  <td style={{ padding: '12px' }}>{c.teblig_tarihi}</td>
                  <td style={{ padding: '12px', color: '#dc3545', fontWeight: '500' }}>{c.itiraz_son_tarihi}</td>
                  <td style={{ padding: '12px' }}><span style={{ color: '#f0ad4e', fontWeight: 'bold' }}>{c.durum}</span></td>
                </tr>
              ))}
              {cezalar.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>Henüz kaydedilmiş bir ceza kararı bulunmuyor.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
