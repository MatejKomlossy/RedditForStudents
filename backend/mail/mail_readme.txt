V priečinku "mail/emails_massage" sa nachádzajú textové súbory, ktoré obsahujú
texty mailov, ktoré sa majú posielať. Tieto súbory sú určené správcovi systému
a dajú sa ľubovoľne upravovať, súbory sú v textovej podobe, prípadní vývojári
to môžu ľahko previesť do html súborov.
Vo väčšine textových súborov sa nachádza označenie {document} – ktoré sa pri
posielaní mailu nahradí menom dokumentu a linkom na dokument.

Úlohy jednotlivých mailov sú:

* massage_welcome.txt            uvítací mail pri nahodení do systému
* message_doc_old_employees.txt  mail pri nutnosti skorého podpísania z pohľadu radového z.
* message_new_doc_employees.txt  mail pri novom dokumente z pohľadu radového z.
* message_new_doc_manager.txt    mail pri novom dokumente z pohľadu nadriadeného
* message_old_doc.txt            mail pre adminov info(notify) o starých dokumentoch, ktoré treba aktualizovať
* message_old_doc_manager.txt    mail pri nutnosti skorého podpísania z pohľadu nadriadeného
* message_training.txt           mail pri nepodpísaní tréningu

treba si však všimnúť aj "mail/configs/emails_of_admins.txt", ktorý obsahuje maily
adminov, ktorým má posielať notifikácie  o starých dokumentoch, ktoré treba aktualizovať.