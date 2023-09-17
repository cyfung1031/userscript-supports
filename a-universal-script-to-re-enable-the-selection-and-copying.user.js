// ==UserScript==
// @name                Selection and Copying Restorer (Universal)
// @name:zh-TW          Selection and Copying Restorer (Universal)
// @name:zh-CN          选择和复制还原器（通用）
// @version             1.18.0.0
// @description         Unlock right-click, remove restrictions on copy, cut, select text, right-click menu, text copying, text selection, image right-click, and enhance functionality: Alt key hyperlink text selection.
// @namespace           https://greasyfork.org/users/371179
// @author              CY Fung
// @supportURL          https://github.com/cyfung1031/userscript-supports
// @run-at              document-start
// @match               http://*/*
// @match               https://*/*
// @exclude             /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
// @exclude             https://github.dev/*
// @exclude             https://www.photopea.com/*
// @exclude             https://drive.google.com/*
// @exclude             https://mail.google.com/*
// @exclude             https://www.google.com/maps/*
// @exclude             https://www.dropbox.com/*
// @exclude             https://outlook.live.com/mail/*
// @exclude             https://www.photopea.com/*
// @exclude             https://www.terabox.com/*
// @icon                https://github.com/cyfung1031/userscript-supports/raw/main/icons/selection-copier.png
// @grant               GM_registerMenuCommand
// @grant               GM_unregisterMenuCommand
// @grant               GM.setValue
// @grant               GM.getValue
// @grant               GM_addValueChangeListener
// @grant               unsafeWindow
// @inject-into         page

// @compatible          firefox Violentmonkey
// @compatible          firefox Tampermonkey
// @compatible          chrome Violentmonkey
// @compatible          chrome Tampermonkey
// @compatible          opera Violentmonkey
// @compatible          opera Tampermonkey
// @compatible          safari Stay
// @compatible          edge Violentmonkey
// @compatible          edge Tampermonkey
// @compatible          brave Violentmonkey
// @compatible          brave Tampermonkey

// @description:zh-TW   破解鎖右鍵，解除禁止復制、剪切、選擇文本、右鍵菜單、文字複製、文字選取、圖片右鍵等限制。增強功能：Alt鍵超連結文字選取。
// @description:zh-CN   破解锁右键，解除禁止复制、剪切、选择文本、右键菜单、文字复制、文字选取、图片右键等限制。增强功能：Alt键超连结文字选取。

// @description:ja    右クリックを解除し、コピー、切り取り、テキスト選択、コンテキストメニュー、テキストのコピー、テキストの選択、画像の右クリックなどの制限を解除します。機能の強化：Altキーでハイパーリンクテキストの選択ができます。
// @description:ko    우클릭 잠금 해제, 복사, 잘라내기, 텍스트 선택, 컨텍스트 메뉴, 텍스트 복사, 텍스트 선택, 이미지 우클릭 등의 제한을 해제합니다. 기능 강화: Alt 키로 하이퍼링크 텍스트 선택.
// @description:ru    Взломать запрет правой кнопкой мыши, снять ограничения на копирование, вырезание, выбор текста, контекстное меню, копирование текста, выбор текста, правая кнопка мыши на изображении и т.д. Усиление функций: выбор текста гиперссылки с помощью клавиши Alt.
// @description:af    Ontsloot regskliek, verwyder beperkings op kopieer, uitknip, teks selekteer, konteks-menu, teks kopieer, teks selekteer, prentjie regskliek, ensovoorts. Versterk funksie: Alt-sleutel vir skakelteks seleksie.
// @description:az    Sağ klikkiləri açın, kopyala, kəs, mətn seçin, kontekst menyusu, mətni kopyalayın, mətni seçin, şəkil sağ klikk, kimi məhdudiyyətlərdən azad olun. Gücləndirilmiş funksiya: Alt düyməsi ilə hiperlink mətn seçimi.
// @description:id    Buka blokir klik kanan, hapus pembatasan penyalinan, pemotongan, memilih teks, menu klik kanan, menyalin teks, memilih teks, klik kanan gambar, dan sebagainya. Peningkatan fitur: Pilih teks tautan dengan tombol Alt.
// @description:ms    Buka kunci klik kanan, hapuskan sekatan salin, potong, pilih teks, menu klik kanan, salin teks, pilih teks, klik kanan imej, dan lain-lain. Tingkatkan ciri: Pilih teks pautan dengan tombol Alt.
// @description:bs    Otključaj desni klik, ukloni ograničenja kopiranja, izrezivanja, odabira teksta, desni klik menija, kopiranja teksta, odabira teksta, desni klik na slici i tako dalje. Poboljšane funkcije: Odabir teksta hiperveze pomoću tipke Alt.
// @description:ca    Desbloqueja el clic dret, elimina les restriccions de còpia, talla, selecció de text, menú contextual, còpia de text, selecció de text, clic dret a la imatge, i així successivament. Millora de funcionalitats: selecció de text d'enllaç amb la tecla Alt.
// @description:cs    Odemkněte pravé tlačítko myši, odstraňte omezení kopírování, výstřižek, výběru textu, kontextového menu, kopírování textu, výběru textu, pravého tlačítka myši na obrázku atd. Vylepšené funkce: Výběr textu hypertextového odkazu pomocí klávesy Alt.
// @description:da    Lås højreklik op, fjern begrænsninger for kopiering, klipning, tekstvalg, højreklikmenu, tekstkopiering, tekstvalg, højreklik på billede osv. Forbedrede funktioner: Vælg teksten af hyperlink ved hjælp af Alt-tasten.
// @description:de    Entsperren Sie den Rechtsklick, entfernen Sie Einschränkungen für Kopieren, Ausschneiden, Textauswahl, Rechtsklickmenü, Textkopieren, Textauswahl, Rechtsklick auf ein Bild usw. Verbesserte Funktionen: Auswahl des Textes eines Hyperlinks mit der Alt-Taste.
// @description:et    Vabastage paremklõps, eemaldage piirangud kopeerimisel, lõikamisel, teksti valimisel, paremklõpsumenüüs, teksti kopeerimisel, teksti valimisel, pildi paremklõpsamisel jne. Täiustatud funktsioonid: valige hüperlingi tekst Alt-klahviga.
// @description:es    Desbloquear clic derecho, eliminar restricciones de copia, corte, selección de texto, menú contextual, copia de texto, selección de texto, clic derecho en imagen, etc. Mejora de funciones: selección de texto de hipervínculo con la tecla Alt.
// @description:eu    Eskubiko klika desblokeatu, kopiatzearen murrizketak kentzen, ebakiak, testua hautatu, klik ezkerreko menua, testuaren kopia, testuaren hautapena, irudiko eskubiko klika, eta abar. Hobetu funtzioak: Hiperestekaren testu hautapena Alt tekla bidez.
// @description:fr    Débloquez le clic droit, supprimez les restrictions de copie, de découpe, de sélection de texte, de menu clic droit, de copie de texte, de sélection de texte, de clic droit sur l'image, etc. Améliorez les fonctionnalités : Sélectionnez le texte du lien hypertexte avec la touche Alt.
// @description:gl    Desbloquear o clic dereito, eliminar as restricións de copia, recorte, selección de texto, menú contextual, copia de texto, selección de texto, clic dereito na imaxe, etc. Mellora das funcións: Seleccione o texto do hipervínculo coa tecla Alt.
// @description:hr    Otključajte desni klik, uklonite ograničenja kopiranja, izrezivanja, odabira teksta, desni klik izbornika, kopiranja teksta, odabira teksta, desni klik na slici itd. Poboljšane funkcije: Odaberite tekst hiperlinka pomoću tipke Alt.
// @description:zu    Sushintsha isikhuthazo sangokucindezela, lungisa imilayezo yokuqhutshwa, ukuketha umfundi, imenyu yokuqhutshwa, ukukopisha umlayezo, ukukhetha umlayezo, uqhube ikhasi lokucindezelwa kwesithombe, noma kanye. Enhla kwezinhlelo: Khetha umbhalo wohlelo lokuqhubekisa ngekhodi ye-Alt.
// @description:is    Opna hægri smell, fjarlægðu takmörk á afriti, klippingu, textavalinu, hægrismelltu valmynd, textaafriti, textavalinu, hægri smelltu á mynd o.fl. Styrktarstig: Veldu texta tengils með Alt-takk
// @description:it    Sblocca il clic destro, rimuovi le restrizioni di copia, taglia, selezione del testo, menu contestuale, copia del testo, selezione del testo, clic destro su un'immagine, ecc. Migliora le funzionalità: seleziona il testo del collegamento ipertestuale con il tasto Alt.
// @description:sw    Fungua Bonyeza-Kulia, Ondoa Vizuizi vya Kunakili, Kukata, Kuteua Maandishi, Menyu ya Bonyeza-Kulia, Kunakili Maandishi, Kuteua Maandishi, Bonyeza-Kulia kwenye Picha, na kadhalika. Boresha Kazi: Teua Nakala ya Kiunganishi cha Maandishi kwa Kutumia Kitufe cha Alt.
// @description:lv    Atbloķēt labo peles pogu, noņemt ierobežojumus attēla kopēšanā, izgriešanā, teksta izvēlē, labā peles kliķa izvēlnē, teksta kopēšanā, teksta izvēlē, un tā tālāk. Uzlabotas funkcijas: Atlaseshiperhipersaites teksts ar Alt taustiņu.
// @description:lt    Atrakinti dešinįjį pelės klavišą, pašalinti apribojimus kopijavimui, iškirpimui, teksto pasirinkimui, dešiniojo pelės klavišo meniu, teksto kopijavimui, teksto pasirinkimui, dešinysis pelės klavišas ant paveikslėlio ir tt. Pakeistos funkcijos: Pasirinkite hiperkryžiaus teksto su Alt klavišu.
// @description:hu    Feloldja a jobb egérgomb tiltását, megszünteti a másolás, kivágás, szövegkijelölés, jobb egérgomb menü, szövegmásolás, szövegválasztás, kép jobb egérgombjának stb. korlátozásait. Fejlesztett funkciók: Hiperhivatkozás szöveg kijelölése az Alt billentyű segítségével.
// @description:nl    Ontgrendel rechtsklikken, verwijder beperkingen op kopiëren, knippen, tekst selecteren, rechtsklikmenu, tekst kopiëren, tekst selecteren, rechtsklikken op afbeelding, enzovoort. Versterk functies: Selecteer tekst van hyperlink met Alt-toets.
// @description:uz    O'ng tugmani oching, nusxalash, kesish, matn tanlash, o'ng tugmasi menyusi, matn nusxalash, matn tanlash, tasvirda o'ng tugmani va hokazo chegaralarni bekor qiling. Qo'shimcha imkoniyatlar: Hyperlink matnini Alt tugmasi bilan tanlang.
// @description:pl    Odblokuj prawy przycisk myszy, usuń ograniczenia kopiowania, wycinania, zaznaczania tekstu, menu kontekstowego, kopiowania tekstu, zaznaczania tekstu, prawego przycisku myszy na obrazie, itp. Wzmocnione funkcje: Wybierz tekst hiperłącza za pomocą klawisza Alt.
// @description:pt    Desbloquear o clique direito, remover restrições de cópia, recorte, seleção de texto, menu de clique direito, cópia de texto, seleção de texto, clique direito em imagem, etc. Melhorar recursos: Selecionar texto do link com a tecla Alt.
// @description:pt-BR Desbloquear o clique direito, remover restrições de cópia, recorte, seleção de texto, menu de clique direito, cópia de texto, seleção de texto, clique direito em imagem, etc. Melhorar recursos: Selecionar texto de hiperlink com a tecla Alt.
// @description:ro    Deblocați clic dreapta, eliminați restricțiile de copiere, tăiere, selectare text, meniu clic dreapta, copiere text, selectare text, clic dreapta pe imagine, etc. Îmbunătățirea funcționalității: Selectați textul unui hyperlink cu tasta Alt.
// @description:sq    Zbulo klikimin e djathtë, hiqni kufizimet për kopjimin, prerjen, zgjedhjen e tekstit, menynë e klikimit të djathtë, kopjimin e tekstit, zgjedhjen e tekstit, klikimin e djathtë në imazh, dhe të tjera. Përmirësim i funksioneve: Zgjidhni tekstin e lidhjes me tastinë Alt.
// @description:sk    Odomknite pravé tlačidlo myši, odstráňte obmedzenia kopírovania, výrezu, výberu textu, kontextového menu, kopírovania textu, výberu textu, pravého tlačidla myši na obrázku atď. Vylepšené funkcie: Výber textu hypertextového odkazu pomocou klávesy Alt.
// @description:sl    Odklenite desni klik, odstranite omejitve kopiranja, izrezovanja, izbire besedila, desni klik menija, kopiranja besedila, izbire besedila, desni klik na sliki itd. Izboljšane funkcije: Izberite besedilo hiperpovezave s tipko Alt.
// @description:sr    Одкључајте десни клик, уклоните ограничења за копирање, исецање, избор текста, десни клик мени, копирање текста, избор текста, десни клик на слици итд. Побољшане функције: Изаберите текст хипервезе притиском на тастер Alt.
// @description:fi    Poista oikean hiiren painikkeen esto, poista rajoitukset kopioinnilta, leikkaamiselta, tekstin valinnalta, oikean hiiren painikkeen valikolta, tekstin kopiointilta, tekstin valinnalta, kuvan oikealta hiiren painikkeelta jne. Paranna toimintoja: Valitse hyperlinkin teksti Alt-näppäimellä.
// @description:sv    Lås upp högerklick, ta bort begränsningar för kopiering, klippning, textval, högerklickmeny, textkopiering, textval, högerklick på bild, etc. Förbättra funktioner: Välj text av hyperlänk med Alt-tangenten.
// @description:vi    Mở khóa chuột phải, loại bỏ hạn chế sao chép, cắt, chọn văn bản, menu chuột phải, sao chép văn bản, chọn văn bản, chuột phải trên hình ảnh, vv. Tăng cường tính năng: Chọn văn bản liên kết với phím Alt.
// @description:tr    Sağ tıklamayı açın, kopyalama, kesme, metin seçme, sağ tık menüsü, metin kopyalama, metin seçme, resimde sağ tıklama vb. kısıtlamaları kaldırın. İyileştirilmiş işlevler: Alt tuşuyla bağlantı metni seçin.
// @description:be    Разблакаваць правы клік, скасаваць абмежаванні па капіраванні, выразі, выбару тэксту, кантэкстнага меню, капіравання тэксту, выбару тэксту, правага кліку на малюнку і г. д. Пашыраныя функцыі: Выберыце тэкст гіперспасылкі з дапамогай клавішы Alt.
// @description:bg    Разкодирайте десен бутон, премахнете ограниченията за копиране, изрязване, избор на текст, контекстно меню, копиране на текст, избор на текст, десен бутон върху изображение и т.н. Подобрени функции: Избор на текст на хипервръзка с бутона Alt.
// @description:ky    Оң жаңыкты ачыңыз, көчүрмө, тандоо тексти, оң кликтык меню, текстти көчүрүү, тексти тандаңыз, сүрөттө оң кликтүү боюнча чеделерди алыңыз ж.б. Коюлу функциялар: Alt түймөсү боюнча желек текстти тандаңыз.
// @description:kk    Оң басқару түймесін ашыңыз, көшіру, мәтінді таңдау, оң баспас меню, мәтінді көшіру, мәтінді таңдау, суретте оң баспас еткізу ж.б. шектіліктерді алыңыз. Дайындауларды жеткізіңіз: Alt түймесімен қосымша түймен текстті таңдаңыз.
// @description:mk    Отклучете го десниот клик, отстрани ограничувања за копирање, исечење, избор на текст, десни клик мени, копирање на текст, избор на текст, десен клик на слика итн. Подобрување на функциите: Изберете текст на хиперлинк со копчето Alt.
// @description:mn    Зүүн дараалжаа сэргээх, хуулах, текст сонгох, зүүн дараалжын цэс, текст хуулах, текст сонгох, зураг дээр зүүн дараахыг сонгох гэх мэт хязгаарыг цуцлах. Үйлдэл нэмэх: Alt товчлуур ашиглан холбоосын текстээ сонгоно уу.
// @description:uk    Розблокуйте правий клік, видаліть обмеження щодо копіювання, вирізання, вибору тексту, контекстного меню, копіювання тексту, вибору тексту, правий клік на зображенні тощо. Покращені функції: Вибір тексту гіперпосилання за допомогою клавіші Alt.
// @description:el    Ξεκλειδώστε το δεξί κλικ, καταργήστε τους περιορισμούς αντιγραφής, αποκοπής, επιλογής κειμένου, μενού δεξιού κλικ, αντιγραφής κειμένου, επιλογής κειμένου, δεξί κλικ σε εικόνα κ.λπ. Βελτιωμένες λειτουργίες: Επιλογή κειμένου υπερσυνδέσμου με το πλήκτρο Alt.
// @description:hy    Բացեք աջ կոճակը, հանեք պահեստավորումները ֆայլի պատճենում, նշումը, տեքստի ընտրությունը, աջ կոճակի մենյուում, տեքստի պատճենումը, տեքստի ընտրությունը, աջ կոճակ պատկերի վրա և այլն: Մասնակցային ֆունկցիաների ընդհանուրավորում. Նշեք հիպերհղման տեքստը Alt ստեղնով:
// @description:ur    دائیں کلک کھولیں، کاپی، کٹ، متن منتخب کریں، دائیں کلک مینو، متن کاپی، متن منتخب کریں، تصویر پر دائیں کلک وغیرہ کی پابندیوں کو ختم کریں۔ تازہ کاری شدہ خصوصیات: Alt کلید کے ساتھ ہائپر لنک متن کا انتخاب کریں۔
// @description:ar    فتح النقرة اليمنى ، إزالة قيود النسخ ، القص ، اختيار النص ، قائمة النقرة اليمنى ، نسخ النص ، اختيار النص ، نقرة يمنى على الصورة ، وما إلى ذلك. تعزيز الوظائف: حدد نص الارتباط باستخدام مفتاح Alt.
// @description:fa    باز کردن کلیک راست ، برداشتن محدودیت های کپی ، برش ، انتخاب متن ، منوی کلیک راست ، کپی متن ، انتخاب متن ، کلیک راست بر روی تصویر و غیره. تقویت ویژگی ها: انتخاب متن پیوند با کلید Alt.
// @description:ne    दायाँ क्लिक खोल्नुहोस्, प्रतिलिपि, काट, पाठ चयन गर्नुहोस्, दायाँ क्लिक मेनु, पाठ प्रतिलिपि, पाठ चयन, तस्वीरमा दायाँ क्लिक, आदिको सीमाहरू हटाउनुहोस्। सुधारिएका सुविधाहरू: एल्ट बटनसहित हायपरलिंक पाठ छान्नुहोस्।
// @description:mr    उजवा क्लिक अनलॉक करा, प्रतिलिपि, कट, मजकूर निवडा, उजवा क्लिक मेनू, मजकूर प्रतिलिपि, मजकूर निवडा, प्रतिमेवर उजवा क्लिक इत्यादी सीमांकन काढा. सुधारित क्षमता: आल्ट की बटणाच्या मदतीने हायपरलिंकमधील मजकूर निवडा.
// @description:hi    दायीं क्लिक अनलॉक करें, प्रतिलिपि, कट, पाठ चयन करें, दायीं क्लिक मेन्यू, पाठ प्रतिलिपि, पाठ चयन, छवि पर दायीं क्लिक इत्यादि प्रतिबंधों को हटाएँ। सुधारित सुविधाएं: एल्ट कुंजी के साथ हाइपरलिंक पाठ चयन करें।
// @description:as    সোণা ক্লিক আনলক কৰক, প্ৰতিলিপি কৰক, কেটা কৰক, পাঠ বাছনি কৰক, সোণা ক্লিক মেনু, পাঠৰ প্ৰতিলিপি কৰক, পাঠ বাছনি কৰক, ছবিৰ সোণা ক্লিক আদিক। উন্নত সুবিধাসমূহ: আল্ট বুটামটো সহ হাইপাৰলিংকৰ পাঠ বাছনি কৰক।
// @description:bn    ডান ক্লিক আনলক করুন, কপি, কাট, পাঠ নির্বাচন করুন, ডান ক্লিক মেনু, পাঠ কপি, পাঠ নির্বাচন, চিত্রে ডান ক্লিক ইত্যাদি সীমাবদ্ধতা অপসারণ করুন। উন্নত বৈশিষ্ট্যগুলি: এল্ট বাটন সহ হাইপারলিংক পাঠ নির্বাচন করুন।
// @description:pa    ਸੱਜਾ ਕਲਿੱਕ ਖੋਲੋ, ਪਾਉਣੀ, ਕੱਟੋ, ਲਿਖਤ ਚੁਣੋ, ਸੱਜਾ ਕਲਿੱਕ ਮੀਨੂ, ਲਿਖਤ ਪਾਉਣੀ, ਲਿਖਤ ਚੁਣੋ, ਚਿੱਤਰ 'ਤੇ ਸੱਜਾ ਕਲਿੱਕ ਵਗੈਰਹ ਪਾਬੰਦੀਆਂ ਹਟਾਓ। ਸੁਧਾਰਿਤ ਫੀਚਰਾਂ: ਐਲਟ ਬਟਨ ਨਾਲ ਹਾਇਪਰਲਿੰਕ ਦੀ ਲਿਖਤ ਚੋਣ ਕਰੋ।
// @description:gu    જમણી ક્લિક ખોલો, કૉપિ, કાપો, ટેક્સ્ટ પસંદ કરો, જમણી ક્લિક મેનૂ, ટેક્સ્ટ કૉપિ, ટેક્સ્ટ પસંદ, ચિત્ર પર જમણી ક્લિક વગેરે પાબંધીઓ કાઢો. સુધારેલી વૈશિષ્ટ્યો: એલ્ટ બટન સાથે હાયપરલિંકના ટેક્સ્ટ પસંદ કરો.
// @description:or    ଡାହାଣହାତରେ ଖୋଲନ୍ତୁ, କପି କରିବା, କଟି କରିବା, ପାଠବାରେ ଚୟନ କରିବା, ଡାହାଣହାତ ମେନୁ, ପାଠବା ଏବଂ ଚିତ୍ର ଡାହାଣହାତ ପାଠ ଚୟନର ମର୍ମ୍ମ କେତେଟେ ପାରିବେ ବିବରଣୀ ମିଳିବା: ଅଲ୍ଟ କୀ ହେଇଲା ହାଇପରଲିଙ୍କ ପାଠ ଚୟନ।
// @description:ta    வலப்பதிவு மூலம் தடைகளை நீக்குங்கள், நகலைப் பட்டைக்கு மாற்றுங்கள், உரையை தேர்வு செய்யுங்கள், வலப்பதிவு மெனு, உரை நகலைப் படக்குகள், உரை தேர்வுகளைப் படக்குகள், பட வலப்பதிவுகள் போன்ற வரைபடங்களின் வரைபடத்தை அதிகரித்துக்கொள்ளுங்கள். அதிகப்படியான செயல்பாடு: அல்ட் விசை அடைவு உரை தேர்வு.
// @description:te    డౌన్‌లోడ్ చేయడానికి రైట్ క్లిక్ ని అనుమతించండి, నకలు, కట్, వచ్చేయి, కుడిచేయండి, టెక్స్ట్ నకలుచేయండి, చిత్రం రైట్ క్లిక్ చేయండి, అదనపు కొంత క్షేత్రాలను మెరుగుపరచండి: అల్ట్ కీ హైపర్‌లింక్ టెక్స్ట్ ఎంపికను పెంచుతుంది.
// @description:kn    ಬಲ ಕ್ಲಿಕ್ ಬಿರುದುಗಳನ್ನು ತೆರೆಯಲು ಅನುಮತಿಸುವುದು, ನಕಲು, ಕಟ್ಟು, ಆಯ್ಕೆ ಮಾಡುವುದು, ಬಲ ಕ್ಲಿಕ್ ಮೆನು, ಪಠ್ಯ ನಕಲು, ಪಠ್ಯ ಆಯ್ಕೆ, ಚಿತ್ರ ಬಲ ಕ್ಲಿಕ್ ಮುಂತಾದ ಮಿತಿಗಳನ್ನು ತೆಗೆದುಹಾಕಿ. ಪ್ರಭಾವವನ್ನು ಹೆಚ್ಚಿಸುವುದು: Alt ಕೀ ಹೈಪರ್‌ಲಿಂಕ್ ಪಠ್ಯ ಆಯ್ಕೆ.
// @description:ml    വലത് ക്ലിക്ക് അനുവദനീയമാക്കുക, പകരം പകർത്തുക, ടെക്സ്റ്റ് തിരിച്ചുവയ്ക്കുക, റൈറ്റ്-ക്ലിക്ക് മെനു, ടെക്സ്റ്റ് പകർത്തൽ, ടെക്സ്റ്റ് തിരിച്ചൽ, ചിത്രം റൈറ്റ്-ക്ലിക്ക് എന്നിവ നീക്കംചെയ്യുക. പ്രവർത്തനം വരുത്തുക: Alt കീ ഹൈപർലിങ്ക് ടെക്സ്റ്റ് തിരിച്ചൽ.
// @description:si    දකුණු ක්ලික් කරන්න ඉඩ දෙන්න, පිටුව පිරවීම, පෙළ තෝරාගන්නවා, දකුණු ක්ලික් මෙනුව, පෙළ පිරවීම, පෙළ තෝරාගන්න, පින්තුර දකුණු ක්ලික් කරන්න ඇති සීමාවෙන් සහාය ලෙස වැහියාව ඇති ක්ලික් විශේෂිත: Alt යතුර හයිපර්ලින්ක් පෙළ තෝරාගන්න.
// @description:th    ปลดล็อกคลิกขวาเพื่อย้าย, ย้าย, เลือกข้อความ, เมนูคลิกขวา, คัดลอกข้อความ, เลือกข้อความ, คลิกขวาภาพ และเพิ่มฟังก์ชัน: คีย์ Alt เพื่อเลือกข้อความลิงก์
// @description:lo    ປິດການຄວບຄຸມຂອງຄລິບບີກມາ, ລືມ, ປ້ອງກັນຂໍ້ມູນ, ບໍ່ສາມາດປິດຄໍາເວລາການຄວບຄຸມ, ຄຳສັ່ງຂໍ້ມູນ, ຄຳເລືອກຂໍ້ມູນ, ຂອບເຂດປະສານຂອງຮູບພາບ, ການຮຽກຮູບຂອງຂ້ອຍແລ້ວ. ປີ້ນດີໃຫ້: Alt ເຄື່ອນຍຸກສະແດງຂ້ອຍກຳລັງເລືອກຂ້ອຍຂອງລິ້ງສຽງ.
// @description:my    ရိုးရှင်းမည့်နေရာများကို ဖျောက်ပြောင်းရန် ရှိနိုင်ပါသည်။ ကျေးဇူးပြု၍ စာသား ကို ကော်ပီအောင် ရှင်းမည်မဟုတ်ပါ။
// @description:ka    მარჯვნივ დააკლიკეთ უფლებებს, დააკოპირეთ, არჩევანის ტექსტი, მარჯვნივ კლიკის მენიუ, ტექსტის კოპირება, ტექსტის არჩევა, სურათის მარჯვნივ კლიკი და გამოწერა, დაამატეთ ფუნქციები: Alt ღილაკის დაჭერით ტექსტის არჩევა.
// @description:am    የቀኝ ጠቋሚውን ምቀይረህ ለማውረድ ያደረጉትን ማንኛውንም ማግኛት ሊያሳይ ይችላሉ, ቅጥ ወይም የጽሁፍ መጻፊያውን ለመርዝ ያደረጉትን ማንኛውንም ማግኛት ሊያሳይ ይችላሉ. መልክዎ ከፍተኛ ስለሆነ: Alt አውታርክ ጽሁፍ መርዝ መርጃዎን.
// @description:km    ដាក់អនុញ្ញាតឱ្យចុចត្រូវលើរបារអង្គចុចស្ដាប់, បិទ, ជ្រើសរើសអត្ថបទ, ម៉ឺនុយចុចស្ដាប់, ការចម្អិនអត្ថបទ, ការជ្រើសរើសអត្ថបទ, ចុចត្រូវលើរបាររូបភាព និងបន្ថែមមនុស្សពីអត្ថបទ: Alt កិច្ចការតម្រូវការចម្អិនអត្ថបទ។
// ==/UserScript==
(async function () {
    'use strict';

    const uWin = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    if (!(uWin instanceof Window)) return;

    /** @type {globalThis.PromiseConstructor} */
    const Promise = (async () => { })().constructor;// YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.

    /** @type {() => Selection | null} */
    const getSelection = uWin.getSelection.bind(uWin) || Error()();
    /** @type {(callback: FrameRequestCallback) => number} */
    const requestAnimationFrame = uWin.requestAnimationFrame.bind(uWin) || Error()();
    /** @type {(elt: Element, pseudoElt?: string | null) => CSSStyleDeclaration} */
    const getComputedStyle = uWin.getComputedStyle.bind(uWin) || Error()();

    const originalFocusFn = HTMLElement.prototype.focus;

    let maxTrial = 16;
    while (!document || !document.documentElement) {
        await new Promise(requestAnimationFrame);
        if (--maxTrial < 0) return;
    }

    const SCRIPT_TAG = "Selection and Copying Restorer (Universal)";
    const $nil = () => { };

    let focusNotAllowedUntil = 0;

    function isLatestBrowser() {
        let res;
        try {
            let o = { $nil };
            o?.$nil();
            o = null;
            o?.$nil();
            res = true;
        } catch (e) { }
        return !!res;
    }
    if (!isLatestBrowser()) console.warn(`${SCRIPT_TAG}: Browser version before 2020-01-01 is not recommended. Please update to the latest version.`);

    function getEventListenerSupport() {
        if ('_b1850' in $) return $._b1850
        let prop = 0;
        document.createAttribute('z').addEventListener('nil', $nil, {
            get passive() {
                prop |= 1;
            },
            get once() {
                prop |= 2;
            }
        });
        return ($._b1850 = prop);
    }

    function isSupportAdvancedEventListener() {
        return (getEventListenerSupport() & 3) === 3;
    }

    function isSupportPassiveEventListener() {
        return (getEventListenerSupport() & 1) === 1;
    }

    function inIframe() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    /*
    const whiteListForCustomContextMenu = [
        'https://drive.google.com/',
        'https://mail.google.com/',
        'https://www.google.com/maps/',
        'https://www.dropbox.com/',
        'https://outlook.live.com/mail/'
    ];
    const isCustomContextMenuAllowedFn = () => {
        const href = location.href;
        for (h of whiteListForCustomContextMenu) {
            if (href.startsWith(h)) return true;
        }
        return false;
    }
    */
    const isCustomContextMenuAllowedFn = () => { return false; }
    let isCustomContextMenuAllowed = null;
    const $ = {
        utSelectionColorHack: 'msmtwejkzrqa',
        utTapHighlight: 'xfcklblvkjsj',
        utLpSelection: 'gykqyzwufxpz',
        utHoverBlock: 'meefgeibrtqx', // scc_emptyblock
        // utNonEmptyElm: 'ilkpvtsnwmjb',
        utNonEmptyElmPrevElm: 'jttkfplemwzo',
        utHoverTextWrap: 'oseksntfvucn',
        ksFuncReplacerCounter: '___dqzadwpujtct___',
        ksEventReturnValue: ' ___ndjfujndrlsx___',
        ksSetData: '___rgqclrdllmhr___',
        ksNonEmptyPlainText: '___grpvyosdjhuk___',

        eh_capture_passive: () => isSupportPassiveEventListener() ? ($._eh_capture_passive = ($._eh_capture_passive || {
            capture: true,
            passive: true
        })) : true,
        eh_capture_active: () => isSupportPassiveEventListener() ? ($._eh_capture_passive = ($._eh_capture_passive || {
            capture: true,
            passive: false
        })) : true,

        mAlert_DOWN: $nil, // dummy function in case alert replacement is not valid
        mAlert_UP: $nil, // dummy function in case alert replacement is not valid


        lpKeyPressing: false,
        lpKeyPressingPromise: Promise.resolve(),

        /** @readonly */
        weakMapFuncReplaced: new WeakMap(),
        ksFuncReplacerCounterId: 0,
        isStackCheckForFuncReplacer: false, // multi-line stack in FireFox
        isGlobalEventCheckForFuncReplacer: false,
        enableReturnValueReplacment: false, // set true by code

        /** @readonly */
        eyEvts: ['keydown', 'keyup', 'copy', 'contextmenu', 'select', 'selectstart', 'dragstart', 'beforecopy'], // slope: throughout
        delayMouseUpTasks: 0,

        isNum: (d) => (d > 0 || d < 0 || d === 0),

        getNodeType: (n) => ((n instanceof Node) ? n.nodeType : -1),

        isAnySelection: function () {
            const sel = getSelection();
            return !sel ? null : (typeof sel.isCollapsed === 'boolean') ? !sel.isCollapsed : (sel.toString().length > 0);
        },

        updateIsWindowEventSupported: function () {
            // https://developer.mozilla.org/en-US/docs/Web/API/Window/event
            // FireFox >= 66
            let p = document.createElement('noscript');
            p.onclick = function (ev) { $.isGlobalEventCheckForFuncReplacer = (window.event === ev) };
            p.dispatchEvent(new Event('click'));
            p = null;
        },

        /**
         *
         * @param {string} cssStyle
         * @param {Node?} container
         * @returns
         */
        createCSSElement: function (cssStyle, container) {
            const css = document.createElement('style'); // slope: DOM throughout
            css.textContent = cssStyle;
            if (container) container.appendChild(css);
            return css;
        },

        createFakeAlert: function (_alert) {
            if (typeof _alert !== 'function') return null;

            function alert(msg) {
                alert.__isDisabled__() ? console.log("alert msg disabled: ", msg) : _alert.apply(this, arguments);
            };
            alert.toString = _alert.toString.bind(_alert);
            return alert;
        },

        /**
         *
         * @param {Function} originalFunc
         * @param {string} pName
         * @returns
         */
        createFuncReplacer: function (originalFunc) {
            const id = ++$.ksFuncReplacerCounterId;
            const resFX = function (ev) {
                const res = originalFunc.apply(this, arguments);
                if (res === false) {
                    if (!this || !ev) return false;
                    const pName = 'on' + ev.type;
                    const selfFunc = this[pName];
                    if (typeof selfFunc !== 'function') return false;
                    if (selfFunc[$.ksFuncReplacerCounter] !== id) return false;
                    // if this is null or undefined, or this.onXXX is not this function
                    if (ev.cancelable !== false && $.isDeactivePreventDefault(ev)) {
                        if ($.isGlobalEventCheckForFuncReplacer === true) {
                            if (window.event !== ev) return false; // eslint-disable-line
                        }
                        if ($.isStackCheckForFuncReplacer === true) {
                            let stack = (new Error()).stack;
                            let onlyOneLineStack = stack.indexOf('\n') === stack.lastIndexOf('\n');
                            if (onlyOneLineStack === false) return false;
                        }
                        return true;
                    }
                }
                return res;
            }
            resFX[$.ksFuncReplacerCounter] = id;
            resFX.toString = originalFunc.toString.bind(originalFunc);
            $.weakMapFuncReplaced.set(originalFunc, resFX);
            return resFX;
        },


        // listenerDisableAll: async (evt) => {
        // },

        onceCssHighlightSelection: async () => {
            if (document.documentElement.hasAttribute($.utLpSelection)) return;
            $.onceCssHighlightSelection = null
            await Promise.resolve();
            const s = [...document.querySelectorAll('a,p,div,span,b,i,strong,li')].filter(elm => elm.childElementCount === 0); // randomly pick an element containing text only to avoid css style bug
            const elm = !s.length ? document.body : s[s.length >> 1];
            await Promise.resolve();
            const selectionStyle = getComputedStyle(elm, '::selection');
            let selectionBackgroundColor = selectionStyle.getPropertyValue('background-color');
            if (/^rgba\(\d+,\s*\d+,\s*\d+,\s*0\)$/.test(selectionBackgroundColor)) {
                document.documentElement.setAttribute($.utSelectionColorHack, "");
            } else {
                let bodyBackgroundColor = getComputedStyle(document.body).getPropertyValue('background-color');
                if (bodyBackgroundColor === selectionBackgroundColor) {
                    document.documentElement.setAttribute($.utSelectionColorHack, "");
                }
            }
            await Promise.resolve();
            const elmStyle = getComputedStyle(elm);
            let highlightColor = elmStyle.getPropertyValue('-webkit-tap-highlight-color');
            if (/^rgba\(\d+,\s*\d+,\s*\d+,\s*0\)$/.test(highlightColor)) document.documentElement.setAttribute($.utTapHighlight, "");
            document.documentElement.setAttribute($.utTapHighlight, "");
        },

        clipDataProcess: function (clipboardData) {

            if (!clipboardData) return;
            const evt = clipboardData[$.ksSetData]; // NOT NULL when preventDefault is called
            if (!evt || evt.clipboardData !== clipboardData) return;
            const plainText = clipboardData[$.ksNonEmptyPlainText]; // NOT NULL when setData is called with non empty input
            if (!plainText) return;

            // BOTH preventDefault and setData are called.

            if (evt.cancelable === false || evt.defaultPrevented === true) return;


            // ---- disable text replacement on plain text node(s) ----

            let cSelection = getSelection();
            if (!cSelection) return; // ?
            let exactSelectionText = cSelection.toString();
            let trimedSelectionText = exactSelectionText.trim();
            if (exactSelectionText.length > 0 && exactSelectionText.length < plainText.length) {
                let pSelection = trimedSelectionText.replace(/[\r\n\t\b\x20\xA0\u200b\uFEFF\u3000]+/g, '');
                let pRequest = plainText.replace(/[\r\n\t\b\x20\xA0\u200b\uFEFF\u3000]+/g, '');
                // a newline char (\n) could be generated between nodes.
                let search = pRequest.indexOf(pSelection);
                if (search >= 0 && search < (plainText.length / 2) + 1 && $.getNodeType(cSelection.anchorNode) === 3 && $.getNodeType(cSelection.focusNode) === 3) {
                    console.log({
                        msg: "copy event - clipboardData replacement is NOT allowed as the text node(s) is/are selected.",
                        oldText: trimedSelectionText,
                        newText: plainText,
                    })
                    return;
                }
            }

            // --- allow preventDefault for text replacement ---

            $.bypass = true;
            evt.preventDefault();
            $.bypass = false;

            // ---- message log ----


            if (trimedSelectionText) {
                // there is replacement data and the selection is not empty
                console.log({
                    msg: "copy event - clipboardData replacement is allowed and the selection is not empty",
                    oldText: trimedSelectionText,
                    newText: plainText,
                })
            } else {
                // there is replacement data and the selection is empty
                console.log({
                    msg: "copy event - clipboardData replacement is allowed and the selection is empty",
                    oldText: trimedSelectionText,
                    newText: plainText,
                })
            }

        },

        isDeactivePreventDefault: function (evt) {
            if (!evt || $.bypass) return false;
            let j = $.eyEvts.indexOf(evt.type);
            const target = evt.target;
            switch (j) {
                case 6: // dragstart

                    if (isCustomContextMenuAllowed === null) isCustomContextMenuAllowed = isCustomContextMenuAllowedFn();
                    if (isCustomContextMenuAllowed) return false;

                    if ($.enableDragging) return false;
                    if (target instanceof Element && target.hasAttribute('draggable')) {
                        $.enableDragging = true;
                        return false;
                    }
                    // if(evt.target.hasAttribute('draggable')&&evt.target!=window.getSelection().anchorNode)return false;
                    return true;
                case 3: // contextmenu

                    if (isCustomContextMenuAllowed === null) isCustomContextMenuAllowed = isCustomContextMenuAllowedFn();
                    if (isCustomContextMenuAllowed) return false;

                    if (target instanceof Element) {
                        switch (target.nodeName) {
                            case 'IMG':
                            case 'SPAN':
                            case 'P':
                            case 'BODY':
                            case 'HTML':
                            case 'A':
                            case 'B':
                            case 'I':
                            case 'PRE':
                            case 'CODE':
                            case 'CENTER':
                            case 'SMALL':
                            case 'SUB':
                            case 'SAMP':
                                return true;
                            case 'VIDEO':
                            case 'AUDIO':
                                return $.gm_native_video_audio_contextmenu ? true: false;
                                
                        }
                        if (target.closest('ytd-player#ytd-player')) return false;
                        if ((target.textContent || "").trim().length === 0 && target.querySelector('video, audio')) {
                            return false; // exclude elements like video
                        }
                    }
                    return true;
                case -1:
                    return false;
                case 0: // keydown
                case 1: // keyup

                    if (isCustomContextMenuAllowed === null) isCustomContextMenuAllowed = isCustomContextMenuAllowedFn();
                    if (isCustomContextMenuAllowed) return false;
                    return (evt.keyCode === 67 && (evt.ctrlKey || evt.metaKey) && !evt.altKey && !evt.shiftKey && $.isAnySelection() === true);
                case 2: // copy

                    if (isCustomContextMenuAllowed === null) isCustomContextMenuAllowed = isCustomContextMenuAllowedFn();
                    if (isCustomContextMenuAllowed) return false;

                    if (!('clipboardData' in evt && 'setData' in DataTransfer.prototype)) return true; // Event oncopy not supporting clipboardData
                    if (evt.cancelable === false || evt.defaultPrevented === true) return true;

                    const cd = evt.clipboardData[$.ksSetData];
                    if (typeof WeakRef === 'function') {
                        let obj = cd ? cd.deref() : null;
                        if (obj && obj !== evt) return true; // in case there is a bug
                        evt.clipboardData[$.ksSetData] = new WeakRef(evt);
                    } else {
                        if (cd && cd !== evt) return true; // in case there is a bug
                        evt.clipboardData[$.ksSetData] = evt;
                    }

                    $.clipDataProcess(evt.clipboardData);

                    return true; // preventDefault in clipDataProcess


                default:
                    return true;
            }
        },

        enableSelectClickCopy: function () {

            !(function ($setData) {
                DataTransfer.prototype.setData = (function setData() {

                    if (arguments[0] === 'text/plain' && typeof arguments[1] === 'string') {
                        if (arguments[1].trim().length > 0) {
                            this[$.ksNonEmptyPlainText] = arguments[1]
                        } else if (this[$.ksNonEmptyPlainText]) {
                            arguments[1] = this[$.ksNonEmptyPlainText]
                        }
                    }

                    $.clipDataProcess(this)

                    let res = $setData.apply(this, arguments)

                    return res;

                })
            })(DataTransfer.prototype.setData);

            Object.defineProperties(DataTransfer.prototype, {
                [$.ksSetData]: { // store the event
                    value: null,
                    writable: true,
                    enumerable: false,
                    configurable: true
                },
                [$.ksNonEmptyPlainText]: { // store the text
                    value: null,
                    writable: true,
                    enumerable: false,
                    configurable: true
                }
            })


            Event.prototype.preventDefault = (function (f) {
                function preventDefault() {
                    if (this.cancelable !== false && !$.isDeactivePreventDefault(this)) f.call(this);
                }
                preventDefault.toString = f.toString.bind(f);
                return preventDefault;
            })(Event.prototype.preventDefault);

            Object.defineProperty(Event.prototype, "returnValue", {
                get() {
                    return $.ksEventReturnValue in this ? this[$.ksEventReturnValue] : true;
                },
                set(newValue) {
                    if (newValue === false) this.preventDefault();
                    this[$.ksEventReturnValue] = newValue;
                },
                enumerable: true,
                configurable: true
            });

            $.enableReturnValueReplacment = true;
            // for (const eyEvt of $.eyEvts) {
            //     document.addEventListener(eyEvt, $.listenerDisableAll, true); // Capture Event; passive:false; expected occurrence COMPLETELY before Target Capture and Target Bubble
            // }

            // userscript bug ?  window.alert not working
            /** @type {Window | null} */
            let window_ = uWin;
            if (window_) {
                let _alert = window_.alert; // slope: temporary
                if (typeof _alert === 'function') {
                    let _mAlert = $.createFakeAlert(_alert);
                    if (_mAlert) {
                        let clickBlockingTo = 0;
                        _mAlert.__isDisabled__ = () => clickBlockingTo > +new Date;
                        $.mAlert_DOWN = () => (clickBlockingTo = +new Date + 50);
                        $.mAlert_UP = () => (clickBlockingTo = +new Date + 20);
                        window_.alert = _mAlert
                    }
                    _mAlert = null;
                }
                _alert = null;
            }
            window_ = null;

        },

        lpCheckPointer: function (targetElm) {
            if (targetElm instanceof Element && targetElm.matches('*:hover')) {
                if (getComputedStyle(targetElm).getPropertyValue('cursor') === 'pointer' && targetElm.textContent) return true;
            }
            return false;
        },

        /**
         *
         * @param {Event} evt
         * @param {boolean} toPreventDefault
         */
        eventCancel: function (evt, toPreventDefault) {
            $.bypass = true;
            !toPreventDefault || evt.preventDefault()
            evt.stopPropagation();
            evt.stopImmediatePropagation();
            $.bypass = false;
        },

        lpHoverBlocks: [],
        lpKeyAltLastPressAt: 0,
        lpKeyAltPressInterval: 0,

        noPlayingVideo: function () {

            // prevent poor video preformance

            let noPlaying = true;
            for (const video of document.querySelectorAll('video[src]')) {

                if (video.paused === false) {
                    noPlaying = false;
                    break;
                }

            }
            return noPlaying;


        },



        /** @type {EventListener} */
        lpKeyDown: (evt) => {

            if (!$.gm_lp_enable) return;

            const isAltPress = (evt.key === "Alt" && evt.altKey && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey);

            if (isAltPress) {

                $.lpKeyAltLastPressAt = +new Date;

                let element = evt.target;


                if ($.lpKeyPressing === false && (element instanceof Node) && element.parentNode && !evt.repeat && $.noPlayingVideo()) {

                    $.lpKeyPressing = true;

                    $.cid_lpKeyPressing = setInterval(() => {
                        if ($.lpKeyAltLastPressAt + 500 < +new Date) {
                            $.lpCancelKeyPressAlt();
                        }
                    }, 137);

                    const rootNode = $.rootHTML(element);
                    if (rootNode) {
                        let tmp_wmEty = null;


                        let wmTextWrap = new WeakMap();

                        $.lpKeyPressingPromise = $.lpKeyPressingPromise.then(() => {
                            for (const elm of $.lpHoverBlocks) {
                                elm.removeAttribute($.utNonEmptyElmPrevElm)
                                elm.removeAttribute($.utHoverTextWrap)
                            }
                            $.lpHoverBlocks.length = 0;
                        }).then(() => {
                            tmp_wmEty = new WeakMap(); // 1,2,3.....: non-empty elm,  -1:empty elm
                            const s = [...rootNode.querySelectorAll('*:not(button, textarea, input, script, noscript, style, link, img, br)')].filter((elm) => elm.childElementCount === 0 && (elm.textContent || '').trim().length > 0)
                            for (const elm of s) tmp_wmEty.set(elm, 1);
                            return s;
                        }).then((s) => {
                            let laterArr = [];
                            let promises = [];

                            let promiseCallback = parentNode => {
                                if (wmTextWrap.get(parentNode) !== null) return;
                                const m = [...parentNode.children].some(elm => {
                                    const value = getComputedStyle(elm).getPropertyValue('z-index');
                                    if (typeof value === 'string' && value.length > 0) return $.isNum(+value)
                                    return false
                                })
                                wmTextWrap.set(parentNode, m)
                                if (m) {
                                    $.lpHoverBlocks.push(parentNode);
                                    parentNode.setAttribute($.utHoverTextWrap, '')
                                }

                            };

                            for (const elm of s) {
                                let qElm = elm;
                                let qi = 1;
                                while (true) {
                                    let pElm = qElm.previousElementSibling;
                                    let anyEmptyHover = false;
                                    while (pElm) {
                                        if (tmp_wmEty.get(pElm) > 0) break;
                                        if (!pElm.matches(`button, textarea, input, script, noscript, style, link, img, br`) && (pElm.textContent || '').length === 0 && pElm.clientWidth * pElm.clientHeight > 0) {
                                            laterArr.push(pElm);
                                            anyEmptyHover = true;
                                        }
                                        pElm = pElm.previousElementSibling;
                                    }
                                    if (anyEmptyHover && !wmTextWrap.has(qElm.parentNode)) {
                                        wmTextWrap.set(qElm.parentNode, null)
                                        promises.push(Promise.resolve(qElm.parentNode).then(promiseCallback))
                                    }
                                    qElm = qElm.parentNode;
                                    if (!qElm || qElm === rootNode) break;
                                    qi++
                                    if (tmp_wmEty.get(qElm) > 0) break;
                                    tmp_wmEty.set(qElm, qi)
                                }
                            }

                            tmp_wmEty = null;

                            Promise.all(promises).then(() => {
                                promises.length = 0;
                                promises = null;
                                promiseCallback = null;
                                for (const pElm of laterArr) {
                                    let parentNode = pElm.parentNode
                                    if (wmTextWrap.get(parentNode) === true) {
                                        $.lpHoverBlocks.push(pElm);
                                        pElm.setAttribute($.utNonEmptyElmPrevElm, '');
                                    }
                                }
                                laterArr.length = 0;
                                laterArr = null;
                                wmTextWrap = null;
                            })
                        })

                    }

                }


            } else if ($.lpKeyPressing === true) {

                $.lpCancelKeyPressAlt();

            }

        },
        lpCancelKeyPressAlt: () => {
            $.lpKeyPressing = false;
            if ($.cid_lpKeyPressing > 0) $.cid_lpKeyPressing = clearInterval($.cid_lpKeyPressing);

            $.lpKeyPressingPromise = $.lpKeyPressingPromise.then(() => {
                for (const elm of $.lpHoverBlocks) {
                    elm.removeAttribute($.utNonEmptyElmPrevElm);
                    elm.removeAttribute($.utHoverTextWrap);
                }
                $.lpHoverBlocks.length = 0;
            })

            setTimeout(function () {
                if ($.lpMouseActive === 1) {
                    $.lpMouseUpClear();
                    $.lpMouseActive = 0;
                }
            }, 32);

        },
        /** @type {EventListener} */
        lpKeyUp: (evt) => {

            if (!$.gm_lp_enable) return;

            if ($.lpKeyPressing === true) {
                $.lpCancelKeyPressAlt();
            }

        },

        lpAltRoots: [],

        /** @type {EventListener} */
        lpMouseDown: (evt) => {

            if (!$.gm_lp_enable) return;

            $.lpMouseActive = 0;
            if (evt.altKey && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey && evt.button === 0 && (evt.target instanceof Node) && $.noPlayingVideo()) {
                $.lpMouseActive = 1;
                $.eventCancel(evt, false);
                const rootNode = $.rootHTML(evt.target);
                $.lpAltRoots.push(rootNode);
                rootNode.setAttribute($.utLpSelection, '');
            }
        },

        lpMouseUpClear: function () {
            for (const rootNode of $.lpAltRoots) rootNode.removeAttribute($.utLpSelection);
            $.lpAltRoots.length = 0;
            if ($.onceCssHighlightSelection) requestAnimationFrame($.onceCssHighlightSelection);
        },

        /** @type {EventListener} */
        lpMouseUp: (evt) => {

            if (!$.gm_lp_enable) return;

            if ($.lpMouseActive === 1) {
                $.lpMouseActive = 2;
                $.eventCancel(evt, false);
                $.lpMouseUpClear();
            }
        },

        /** @type {EventListener} */
        lpClick: (evt) => {

            if (!$.gm_lp_enable) return;

            if ($.lpMouseActive === 2) {
                $.eventCancel(evt, false);
            }
        },

        lpEnable: function () { // this is an optional feature for modern browser
            // the built-in browser feature has already disabled the default event behavior, the coding is just to ensure no "tailor-made behavior" occuring.
            const opt = $.eh_capture_passive();
            document.addEventListener('keydown', $.lpKeyDown, opt)
            document.addEventListener('keyup', $.lpKeyUp, opt)
            document.addEventListener('mousedown', $.lpMouseDown, opt)
            document.addEventListener('mouseup', $.lpMouseUp, opt)
            document.addEventListener('click', $.lpClick, opt)
        },

        /**
         *
         * @param {Node | null} node
         * @returns
         */
        rootHTML: (node) => {

            if (!(node instanceof Node)) return null;
            if (!node.ownerDocument) return node;
            let rootNode = node.getRootNode ? node.getRootNode() : null
            if (!rootNode) {
                let pElm = node;
                for (let parentNode; parentNode = pElm.parentNode;) {
                    pElm = parentNode;
                }
                rootNode = pElm;
            }


            rootNode = rootNode.querySelector('html') || node.ownerDocument.documentElement || null;
            return rootNode

        },

        // note: "user-select: XXX" is deemed as invalid property value in FireFox.

        injectCSSRules: () => {
            const cssStyleOnReady = `

            html {
                --sac-user-select: auto;
            }
            [role="slider"], input, textarea, video[src], :empty {
                --sac-user-select: nil;
            }
            label:not(:empty) {
                --sac-user-select: auto;
            }

            html, html *,
            html *[style], html *[class] {
                -webkit-touch-callout: default !important; -moz-user-select: var(--sac-user-select) !important; -webkit-user-select: var(--sac-user-select) !important; user-select: var(--sac-user-select) !important;
            }

            html *:hover, html *:link, html *:visited, html *:active {
                -webkit-touch-callout: default !important; -moz-user-select: var(--sac-user-select) !important; -webkit-user-select: var(--sac-user-select) !important; user-select: var(--sac-user-select) !important;
            }

            html *::before, html *::after {
                -webkit-touch-callout: default !important; -moz-user-select: auto !important; -webkit-user-select: auto !important; user-select: auto !important;
            }

            *:hover>img[src]{pointer-events:auto !important;}

            [${$.utSelectionColorHack}] :not(input):not(textarea)::selection{ background-color: Highlight !important; color: HighlightText !important;}
            [${$.utSelectionColorHack}] :not(input):not(textarea)::-moz-selection{ background-color: Highlight !important; color: HighlightText !important;}
            [${$.utTapHighlight}] *{ -webkit-tap-highlight-color: rgba(0, 0, 0, 0.18) !important;}

            [${$.utHoverTextWrap}]>[${$.utNonEmptyElmPrevElm}]{pointer-events:none !important;}
            [${$.utHoverTextWrap}]>*{z-index:inherit !important;}

            html[${$.utLpSelection}] *:hover, html[${$.utLpSelection}] *:hover * { cursor:text !important;}
            html[${$.utLpSelection}] :not(input):not(textarea)::selection {background-color: rgba(255, 156, 179, 0.5) !important;}
            html[${$.utLpSelection}] :not(input):not(textarea)::-moz-selection {background-color: rgba(255, 156, 179, 0.5) !important;}

            img[${$.utHoverBlock}="4"]{display:none !important;}
            [${$.utHoverBlock}="7"]{padding:0 !important;overflow:hidden !important;}
            [${$.utHoverBlock}="7"]>img[${$.utHoverBlock}="4"]:first-child{
                display:inline-block !important;
                position: relative !important;
                top: auto !important;
                left: auto !important;
                bottom: auto !important;
                right: auto !important;
                opacity: 0 !important;
                padding: 0 !important;
                margin: 0 !important;
                width: 100% !important;
                height: 100% !important;
                outline: 0 !important;
                border: 0 !important;
                box-sizing: border-box !important;
                transform: initial !important;
                -moz-user-select: none !important;
                -webkit-user-select: none !important;
                user-select: none !important;
                z-index:1 !important;
                float: left !important;
                cursor:inherit !important;
                pointer-events:inherit !important;
                border-radius: inherit !important;
                background:none !important;
            }

            `.trim();
            $.createCSSElement(cssStyleOnReady, document.documentElement);
        },

        disableHoverBlock: () => {

            const nMap = new WeakMap();

            /**
             *
             * @param {HTMLElement} elm
             * @returns
             */
            function elmParam(elm) {
                let mElm = nMap.get(elm);
                if (!mElm) nMap.set(elm, mElm = {});
                return mElm;
            }

            /**
             *
             * @param {DOMRect} rect1
             * @param {DOMRect} rect2
             * @returns
             */
            function overlapArea(rect1, rect2) {

                let l1 = {
                    x: rect1.left,
                    y: rect1.top
                }

                let r1 = {
                    x: rect1.right,
                    y: rect1.bottom
                }
                let l2 = {
                    x: rect2.left,
                    y: rect2.top
                }

                let r2 = {
                    x: rect2.right,
                    y: rect2.bottom
                }

                // Area of 1st Rectangle
                let area1 = Math.abs(l1.x - r1.x) * Math.abs(l1.y - r1.y);

                // Area of 2nd Rectangle
                let area2 = Math.abs(l2.x - r2.x) * Math.abs(l2.y - r2.y);

                // Length of intersecting part i.e
                // start from max(l1.x, l2.x) of
                // x-coordinate and end at min(r1.x,
                // r2.x) x-coordinate by subtracting
                // start from end we get required
                // lengths
                let x_dist = Math.min(r1.x, r2.x) - Math.max(l1.x, l2.x);
                let y_dist = Math.min(r1.y, r2.y) - Math.max(l1.y, l2.y);
                let areaI = 0;
                if (x_dist > 0 && y_dist > 0) {
                    areaI = x_dist * y_dist;
                }

                return {
                    area1,
                    area2,
                    areaI
                };


            }

            function redirectEvent(event, toElement) {

                toElement.dispatchEvent(new event.constructor(event.type, event));
                if (event.type !== 'wheel') event.preventDefault();
                event.stopPropagation();
            }

            /** @type {WeakMap<Node, number>} */
            const floatingBlockHover = new WeakMap();

            /**
                @typedef NImg
                @type {Object}
                @property {HTMLImageElement} elm The Image Element
                @property {number} lastTime lastTime
                @property {number} cid_fade cid for fade

            */

            /** @type { NImg[] } */
            let _nImgs = [];
            const handleNImgs = async (img) => {
                await Promise.resolve();
                for (const s of _nImgs) {
                    if (s.elm === img) {
                        s.lastTime = +new Date
                    }
                }
            }

            function nImgFunc() {

                for (const s of _nImgs) {
                    if (s.lastTime + 800 < +new Date) {
                        s.lastTime = +new Date;
                        return s.elm
                    }
                }

                let nImg = document.createElement('img');
                nImg.setAttribute('title', '　');
                nImg.setAttribute('alt', '　');
                nImg.onerror = function () {
                    if (this.parentNode instanceof Node) this.parentNode.removeChild(this)
                }
                nImg.setAttribute($.utHoverBlock, '4');
                const handle = function (event) {
                    if (this === event.target) {
                        if (event.button !== 2) redirectEvent(event, this.parentNode)
                        handleNImgs(this);
                    }
                }
                nImg.addEventListener('click', handle, true);
                nImg.addEventListener('mousedown', handle, true);
                nImg.addEventListener('mouseup', handle, true);
                nImg.addEventListener('mousemove', handle, true);
                nImg.addEventListener('mouseover', handle, true);
                nImg.addEventListener('mouseout', handle, true);
                nImg.addEventListener('mouseenter', handle, true);
                nImg.addEventListener('mouseleave', handle, true);
                // nImg.addEventListener('wheel', handle, $.eh_capture_passive());
                let resObj = {
                    elm: nImg,
                    lastTime: +new Date,
                    cid_fade: 0
                }
                _nImgs.push(resObj)

                return nImg;

            }

            const wmHoverUrl = new WeakMap();
            /** @type {Node | null} */
            let lastMouseEnterElm = null;
            let lastMouseEnterAt = 0;
            let lastMouseEnterCid = 0;

            const mouseEnter = async (evt) => {

                if (!$.gm_disablehover_enable) return;
                lastMouseEnterElm = evt.target
                lastMouseEnterAt = +new Date;

                if (lastMouseEnterCid) return;
                lastMouseEnterCid = 1;
                do {
                    await new Promise(resolve => setTimeout(resolve, 82));
                } while (+new Date - lastMouseEnterAt < 30);
                lastMouseEnterCid = 0;

                // if($.lpKeyPressing)return;

                /** @type {Node | null} */
                const targetElm = lastMouseEnterElm

                await Promise.resolve();

                if (!targetElm || !targetElm.parentNode) {
                    return;
                }
                if (floatingBlockHover.get(targetElm)) {
                    let url = null
                    if (targetElm.getAttribute($.utHoverBlock) === '7' && (url = wmHoverUrl.get(targetElm)) && targetElm.querySelector(`[${$.utHoverBlock}]`) === null) {
                        let _nImg = nImgFunc();
                        if (_nImg.parentNode !== targetElm) {
                            _nImg.setAttribute('src', url);
                            targetElm.insertBefore(_nImg, targetElm.firstChild);
                        }
                    }
                    return;
                }
                floatingBlockHover.set(targetElm, 1);

                await Promise.resolve();

                if (!(targetElm instanceof Element)) return;
                // if (targetElm.nodeType !== 1) return;
                if ("|SVG|IMG|HTML|BODY|VIDEO|AUDIO|BR|HEAD|NOSCRIPT|SCRIPT|STYLE|TEXTAREA|AREA|INPUT|FORM|BUTTON|".indexOf(`|${targetElm.nodeName}|`) >= 0) return;

                const targetArea = targetElm.clientWidth * targetElm.clientHeight

                if (targetArea > 0) { } else {
                    return;
                }

                /** @type {string | null} */
                let sUrl = null;

                const targetCSS = getComputedStyle(targetElm)
                const targetBgImage = targetCSS.getPropertyValue('background-image');
                let exec1 = null

                if (targetBgImage !== 'none' && (exec1 = /^\s*url\s*\("?([^"\)]+\b(\.gif|\.png|\.jpeg|\.jpg|\.webp)\b[^"\)]*)"?\)\s*$/i.exec(targetBgImage))) {
                    if ((targetElm.textContent || "").trim().length > 0) return;
                    const url = exec1[1];
                    sUrl = url;

                    // console.log(targetBgImage,[...exec1])
                } else {


                    if (targetCSS.getPropertyValue('position') === 'absolute' && +targetCSS.getPropertyValue('z-index') > 0) { } else {
                        return;
                    }
                    if ((targetElm.textContent || "").trim().length > 0) return;

                    let possibleResults = [];

                    for (const imgElm of document.querySelectorAll('img[src]')) {
                        const param = elmParam(imgElm)
                        if (!param.area) {
                            const area = imgElm.clientWidth * imgElm.clientHeight
                            if (area > 0) param.area = area;
                        }
                        if (param.area > 0) {
                            if (targetArea > param.area * 0.9) possibleResults.push(imgElm)
                        }
                    }

                    let i = 0;
                    let j = 0;
                    for (const imgElm of possibleResults) {

                        const cmpVal = targetElm.compareDocumentPosition(imgElm)

                        /*

                            1: The two nodes do not belong to the same document.
                            2: p1 is positioned after p2.
                            4: p1 is positioned before p2.
                            8: p1 is positioned inside p2.
                            16: p2 is positioned inside p1.
                            32: The two nodes has no relationship, or they are two attributes on the same element.

                        */

                        if (cmpVal & 8 || cmpVal & 16) return;
                        if (cmpVal & 2) j++; // I<p
                        else if (cmpVal & 4) break; // I>p


                        i++;

                    }

                    // before: j-1  after: j

                    let indexBefore = j - 1;
                    let indexAfter = j;
                    if (indexBefore < 0) indexBefore = 0;
                    if (indexAfter > possibleResults.length - 1) indexAfter = possibleResults.length - 1;

                    //    setTimeout(function(){
                    for (let i = indexBefore; i <= indexAfter; i++) {
                        const s = possibleResults[i];
                        const {
                            area1,
                            area2,
                            areaI
                        } = overlapArea(targetElm.getBoundingClientRect(), s.getBoundingClientRect())
                        // const criteria = area1 * 0.7
                        if (areaI > 0.9 * area2) {

                            sUrl = s.getAttribute('src');
                            break;

                        }
                    }
                    //   },1000);

                }




                if (typeof sUrl !== 'string') return;

                // console.log(targetElm, targetElm.querySelectorAll('img').length)

                // console.log(313, evt.target, s)
                let _nImg = nImgFunc();


                if (_nImg.parentNode !== targetElm) {
                    _nImg.setAttribute('src', sUrl);
                    targetElm.insertBefore(_nImg, targetElm.firstChild);
                    wmHoverUrl.set(targetElm, sUrl);
                    targetElm.setAttribute($.utHoverBlock, '7');
                }



            }

            document.addEventListener('mouseenter', mouseEnter, $.eh_capture_passive())



        },

        /** @type {EventListener} */
        acrAuxDown: (evt) => {

            if (!$.gm_prevent_aux_click_enable) return;

            if (evt.button === 1) {
                let check = $.dmmMouseUpLast > $.dmmMouseDownLast && evt.timeStamp - $.dmmMouseUpLast < 40
                $.dmmMouseDownLast = evt.timeStamp;
                if (check) {
                    $.eventCancel(evt, true);
                }
            }

        },

        /** @type {EventListener} */
        acrAuxUp: (evt) => {
            if (!$.gm_prevent_aux_click_enable) return;

            if (evt.button === 1) {
                let check = $.dmmMouseDownLast > $.dmmMouseUpLast && evt.timeStamp - $.dmmMouseDownLast < 40;
                $.dmmMouseUpLast = evt.timeStamp;
                if (check) {
                    $.dmmMouseUpCancel = evt.timeStamp;
                    $.eventCancel(evt, true);
                }
            }

        },


        /** @type {EventListener} */
        acrAuxClick: (evt) => {
            if (!$.gm_prevent_aux_click_enable) return;

            if (evt.button === 1) {
                if (evt.timeStamp - $.dmmMouseUpCancel < 40) {
                    $.eventCancel(evt, true);
                }
            }


        },

        // preventAuxClickRepeat: function () {

        //     const opt = $.eh_capture_active();
        //     // document.addEventListener('mousedown', $.acrAuxDown, opt)
        //     // document.addEventListener('mouseup', $.acrAuxUp, opt)
        //     document.addEventListener('auxclick', $.acrAuxClick, opt)


        // },

        mousedownFocus: (evt) => {
            focusNotAllowedUntil = Date.now() + 4;
        },

        mouseupFocus: (evt) => {
            focusNotAllowedUntil = 0;
        },

        MenuEnable: (
            class MenuEnable {

                /**
                 *
                 * @param {string} textToEnable
                 * @param {string} textToDisable
                 * @param {Function} callback
                 * @param {boolean?} initalEnable
                 */
                constructor(textToEnable, textToDisable, callback, initalEnable) {
                    /** @type {number|string|null} */
                    this.h = null;
                    /** @type {string} */
                    this.textToEnable = textToEnable;
                    /** @type {string} */
                    this.textToDisable = textToDisable;
                    /** @type {Function} */
                    this.callback = callback;
                    /** @type {Function} */
                    this.gx = this.gx.bind(this);
                }

                unregister() {
                    (this.h !== null) ? (GM_unregisterMenuCommand(this.h), (this.h = null)) : null;
                }

                register(text) {
                    if (typeof text === 'string') this.showText = text;
                    text = this.showText;
                    if (typeof text !== 'string') return;
                    this.h = GM_registerMenuCommand(text, this.gx);
                }

                a(o) {

                    if (this.enabled === o.bEnable) return;
                    this.enabled = o.bEnable;
                    this.unregister();


                    let pr = 0;

                    if ($.gm_status_fn_store && $.gm_status_fn_store.indexOf(this) >= 0) {

                        let store = $.gm_status_fn_store
                        let idx = store.indexOf(this)
                        let count = store.length;


                        if (idx >= 0 && idx <= count - 2) {

                            // console.log(idx, count)

                            for (let jdx = idx + 1; jdx < count; jdx++) {

                                store[jdx].unregister();
                            }

                            this.register(o.bText);

                            for (let jdx = idx + 1; jdx < count; jdx++) {

                                store[jdx].register();
                            }

                            pr = 1;

                        }


                    }

                    if (!pr) this.register(o.bText);

                    this.callback(this.enabled, o.byUserInput);


                }

                enableNow(byUserInput) {
                    this.a({
                        bEnable: true,
                        bText: this.textToDisable,
                        byUserInput
                    });

                }

                gx() {
                    if (this.enabled) this.disableNow(true);
                    else this.enableNow(true);

                }

                disableNow(byUserInput) {
                    this.a({
                        bEnable: false,
                        bText: this.textToEnable,
                        byUserInput
                    });

                }

                toggle(enable, byUserInput) {
                    enable ? this.enableNow(byUserInput) : this.disableNow(byUserInput);
                }

            }
        ),

        /**
         *
         * @param {string} gm_name
         * @param {string} textToEnable
         * @param {string} textToDisable
         * @param {Function} callback
         */
        gm_status_fn: async function (gm_name, textToEnable, textToDisable, callback) {

            const menuEnableName = gm_name + "$menuEnable";

            function set_gm(enabled) {
                $[gm_name] = enabled;
                const menuEnable = $[menuEnableName];
                if (menuEnable) {
                    menuEnable.toggle(enabled)
                };
                callback(enabled)
            }

            const gmValue = await GM.getValue(gm_name, false);
            set_gm(!!gmValue);

            GM_addValueChangeListener(gm_name, function (name, old_value, new_value, remote) {

                if (old_value === new_value || new_value === $[gm_name]) return;
                set_gm(new_value);

            });

            if (!inIframe()) {

                $.gm_status_fn_store = $.gm_status_fn_store || [];

                $[menuEnableName] = new $.MenuEnable(textToEnable, textToDisable, (enabled) => {
                    GM.setValue(gm_name, !!enabled);
                });

                $.gm_status_fn_store.push($[menuEnableName]);

                const gmValue = await GM.getValue(gm_name, false);
                $[menuEnableName].toggle(!!gmValue);

            }

        },

        /** @type {EventListener} */
        genericEventHandlerLevel2: (evt) => {
            if ($.gm_absolute_mode) {
                // inspired by https://greasyfork.org/en/scripts/23772-absolute-enable-right-click-copy
                evt.stopPropagation();
                evt.stopImmediatePropagation();
            }
            // .. and more

            const evtType = (evt || 0).type

            if (evtType && $.enableReturnValueReplacment === true) {
                // $.listenerDisableAll(evt);
                let elmNode = evt.target;
                const pName = 'on' + evtType;
                let maxN = 99;
                while (elmNode instanceof Node) { // i.e. HTMLDocument or HTMLElement
                    if (--maxN < 4) break; // prevent unknown case
                    const f = elmNode[pName];
                    if (typeof f === 'function') {
                        let replacerId = f[$.ksFuncReplacerCounter];
                        if (replacerId > 0) break; // assume all parent functions are replaced; for performance only
                        // note: "return false" is preventDefault() in VanillaJS but preventDefault()+stopPropagation() in jQuery.
                        elmNode[pName] = $.weakMapFuncReplaced.get(f) || $.createFuncReplacer(f);
                    }
                    elmNode = elmNode.parentNode;
                }
            }

            if (evtType === 'contextmenu') {
                if (evt.defaultPrevented !== true) {
                    $.mainListenerPress(evt);
                }
            }

        },

        /** @type {EventListener} */
        genericEventHandlerLevel1: (evt) => {
            if ($.gm_absolute_mode) {
                // inspired by https://greasyfork.org/en/scripts/23772-absolute-enable-right-click-copy
                evt.stopPropagation();
                evt.stopImmediatePropagation();
            }
            const evtType = (evt || 0).type
            if (evtType === 'mousedown') {
                $.mousedownFocus(evt);
                $.acrAuxDown(evt);
                if (evt.defaultPrevented !== true) {
                    $.mainListenerPress(evt);
                }
            } else if (evtType === 'mouseup') {
                $.mouseupFocus(evt);
                $.acrAuxUp(evt);
                if (evt.defaultPrevented !== true) {
                    $.mainListenerRelease(evt);
                }
            }
        },

        eventsInjection: function () {
            for (const s of ['keydown', 'keyup', 'copy', 'contextmenu', 'select', 'selectstart', 'dragstart', 'beforecopy']) {
                document.addEventListener(s, $.genericEventHandlerLevel2, true);
            }

            for (const s of ['cut', 'paste', 'mouseup', 'mousedown', 'drag', 'select']) {
                document.addEventListener(s, $.genericEventHandlerLevel1, true);
            }

            document.addEventListener('auxclick', $.acrAuxClick, true)
        },

        delayMouseUpTasksHandler: () => {
            if ($.delayMouseUpTasks > 0) {
                const flag = $.delayMouseUpTasks
                $.delayMouseUpTasks = 0;
                if ((flag & 1) === 1) $.mAlert_UP();
                if ((flag & 2) === 2 && $.enableDragging === true) $.enableDragging = false;
            }
        },

        mainListenerPress: (evt) => { // Capture Event; (mousedown - desktop; contextmenu - desktop&mobile)
            //   $.holdingElm=evt.target;
            //   console.log('down',evt.target)
            if ($.onceCssHighlightSelection) requestAnimationFrame($.onceCssHighlightSelection);
            const isContextMenuEvent = evt.type === "contextmenu";
            if (evt.button === 2 || isContextMenuEvent) $.mAlert_DOWN();
            if (isContextMenuEvent && $.delayMouseUpTasks === 0) {
                $.delayMouseUpTasks |= 1;
                requestAnimationFrame($.delayMouseUpTasksHandler)
            }
        },

        mainListenerRelease: (evt) => { // Capture Event; (mouseup - desktop)
            //  $.holdingElm=null;
            //   console.log('up',evt.target)
            if ($.delayMouseUpTasks === 0) { // skip if it is already queued
                if (evt.button === 2) $.delayMouseUpTasks |= 1;
                if ($.enableDragging === true) $.delayMouseUpTasks |= 2;
                if ($.delayMouseUpTasks > 0) {
                    requestAnimationFrame($.delayMouseUpTasksHandler)
                }
            }
        }


    }

    // $.holdingElm=null;
    $.eventsInjection();
    $.enableSelectClickCopy()
    $.injectCSSRules();

    if (isSupportAdvancedEventListener()) $.lpEnable(); // top capture event for alt-click

    $.disableHoverBlock();
    // $.preventAuxClickRepeat();

    console.log(`userscript running - ${SCRIPT_TAG}`);

    $.updateIsWindowEventSupported();

    if (typeof GM_registerMenuCommand === 'function' && typeof GM_unregisterMenuCommand === 'function') {

        if (isSupportAdvancedEventListener()) {
            $.gm_status_fn("gm_lp_enable", "To Enable `Enhanced build-in Alt Text Selection`", "To Disable `Enhanced build-in Alt Text Selection`", () => {
                // callback
            });
        }
        $.gm_status_fn("gm_disablehover_enable", "To Enable `Hover on Image`", "To Disable `Hover on Image`", () => {
            // callback
        });
        $.gm_status_fn("gm_prevent_aux_click_enable", "To Enable `Repetitive AuxClick Prevention`", "To Disable `Repetitive AuxClick Prevention`", () => {
            // callback
        });
        $.gm_status_fn("gm_absolute_mode", "To Enable `Absolute Mode`", "To Disable `Absolute Mode`", () => {
            // callback
        });

        $.gm_status_fn("gm_remain_focus_on_mousedown", "To Enable `Remain Focus On MouseDown`", "To Disable `Remain Focus On MouseDown`", () => {
            // $.gm_remain_focus_on_mousedown = 0;
            // callback
        });

        $.gm_status_fn("gm_native_video_audio_contextmenu", "To Enable Native Video Audio Context Menu", "To Disable Native Video Audio Context Menu", ()=>{
            
        })

    }

    if (typeof originalFocusFn === 'function' && HTMLElement.prototype.focus === originalFocusFn && originalFocusFn.length === 0) {
        const f = HTMLElement.prototype.focus = function () {
            if (focusNotAllowedUntil && $.gm_remain_focus_on_mousedown && focusNotAllowedUntil > Date.now()) return;
            return originalFocusFn.apply(this, arguments);
        }
        f.toString = originalFocusFn.toString.bind(originalFocusFn);
    }


})();