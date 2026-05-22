from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)  # React ön yüzünün bağlanabilmesi için CORS'u açtık

# Şimdilik hafızada tutuyoruz, sonra Firebase'e bağlarız
cezalar_veritabani = []

@app.route('/api/cezalar', methods=['GET'])
def ceza_listele():
    # Güncel ceza listesini döner
    return jsonify(cezalar_veritabani), 200

@app.route('/api/ceza/ekle', methods=['POST'])
def ceza_ekle():
    try:
        data = request.json
        
        # TL ve USD alanları ön yüzden doğrudan gelecek, burada kur çevrimi yok!
        beyanname_no = data.get('beyanname_no')
        ceza_tutari = float(data.get('ceza_tutari', 0))
        para_birimi = data.get('para_birimi')  # 'TL' veya 'USD'
        teblig_tarihi_str = data.get('teblig_tarihi')
        
        if not beyanname_no or len(beyanname_no) != 16:
            return jsonify({"hata": "Beyanname numarası 16 haneli olmalıdır!"}), 400
            
        if para_birimi not in ['TL', 'USD']:
            return jsonify({"hata": "Geçersiz para birimi! Sadece TL veya USD olabilir."}), 400

        # Tebliğ tarihinden otomatik 15 gün sonrasına yasal itiraz süresi hesaplama
        teblig_dt = datetime.strptime(teblig_tarihi_str, '%Y-%m-%d')
        itiraz_son_tarih = teblig_dt + timedelta(days=15)

        yeni_kayit = {
            "id": len(cezalar_veritabani) + 1,
            "beyanname_no": beyanname_no,
            "plaka_no": data.get('plaka_no', ''),
            "ceza_maddesi": data.get('ceza_maddesi', ''),
            "ceza_tutari": ceza_tutari,
            "para_birimi": para_birimi,
            "teblig_tarihi": teblig_tarihi_str,
            "itiraz_son_tarihi": itiraz_son_tarih.strftime('%Y-%m-%d'),
            "durum": "Beklemede"
        }

        cezalar_veritabani.append(yeni_kayit)
        return jsonify({"mesaj": "Ceza başarıyla kaydedildi!", "veri": yeni_kayit}), 201
    except Exception as e:
        return jsonify({"hata": f"Sistemsel hata: {str(e)}"}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
