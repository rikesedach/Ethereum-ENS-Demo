# Eine kurze Einführung in EMS (Ethereum Name Services)

Ein Internet ohne Domain Name Service (DNS) ist kaum vorstellbar. Die direkte Ansprache von Ressourcen auf Basis ihrer IP Adresse wäre ein mühsames und fehleranfälliges unterfangen. Wie schön das es einen Domain Name Service (DNS) gibt, der die Zuordnung zwischen maschinen-lesbaren IP-Adressen und für den Menschen leicht verständlichen, einprägsamen Namen vornimmt. Mit Hilfe von DNS können wir Ressourcen im Internet einfach lokalisieren, auch wenn sich im Hintergrund deren IP-Adressen geändert haben.

Eine ähnliche Funktion wie DNS im Internet, soll ENS in der Ethereum-Blockchain übernehmen. Ressourcen der Ethereum-Blockchain sind in erster Linie Smart Contracts. Diese werde über eine 20 Byte Adresse angesprochen und als 40-stelliger Hex-String dargestellt.

In EIP-137 werden die Kernelemente des Ethereum Name Service spezifiziert. Es sind dies:

+ EMS-Registry
+ Resolvers
+ Registrars

Die ENS-Registry ist ein Contract, der für die Verwaltung von Domain-Namen zuständig ist. Neben dem Mapping von Domain-Namen auf einen verknüpften Resolver Contract, ist die Registry dafür zuständig, dass der Eigentümer einer Domain das Recht hat für diese neue Sub-Domains einzurichten oder Einträge im Resolver zu ändern.

Revolver sind für die Beantwortung von Ressourcenanfragen an eine Domain zuständig, und liefern beispielsweise die Contract-Adresse, die ABI eines Contract oder den Publickey einer Wallet zurück. Jeder Domain-Name enthält einen Verweis auf seinen Resolver.

Der Registrar ist der Eigentümer einer Domain. Nur er hat das Recht neue Sub-Donains zu registrieren oder Ressourcen zu ändern. Registrar sind Contracts oder eigene Accounts. Top- und Second-Level-Donains werden in der Regel mit einem Registrar-Contract verwaltet. So wird beispielweise die Second-Level-Domain des Mainnet durch einen Registrar verwaltet, der ein Auktionsverfahren für die Vergabe von Domains implementiert

Analog zum DNS ist der Namensraum hierarchisch unterteil. Einzelne Domains werden mit einen Punkt voneinander getrennt. Die aus dem DNS bekannte Gliederung in Top-Level-, Second-Level- und Sub-Domains wurde übernommen. Ein gültiger Domain-Namen ist beispielweise: "earth.planets.eth".

Domain-Namen werden im ENS als sha3-Hash (keccak_256) abgebildet. Die Ableitung des Hashs ist über die folgende namehash-Funktion definiert:
```
def namehash(name):
  if name == '':
    return '\0' * 32
  else:
    label, _, remainder = name.partition('.')
    return sha3(namehash(remainder) + sha3(label))
```
Der Hash von "earth.planets.eth", berechnet sich somit wie folgt:
```
sha3(sha3("eth") + sha3(sha3("planets") + sha3("0x0000000000000000000000000000000000000000000000000000000000000000" + sha3("earth"))))
```
## Reverse Name Resolution
Neben dem Mapping eines Domain-Namens auf seine Ressourcen wie Adresse, ABI oder Publickey, bittet ENS ebenfalls ein Reverse-Mapping von einer Adresse auf deren Domain-Namen an. Das Verfahren hierfür ist in EIP-160 beschrieben. Für ein Reverse-Mapping wird die Ressource-Adresse unter dem Reverse-Domain-Name "address".addr.reverse registriert. Der Resovler für den Reverse-Domain-Name hält den Name der ursprünglichen Domain. Der Registrar der Domain "addr.reverse" stellt dafür eine Funktion setName(<Domain-Name>) bereit, unter der ein Aufrufer seinen Domain-Name registriert.

## Beispiel
Das folgende Beispiel zeigt, wie ENS inklusive eines Registrar für Reverse Name Resolution installiert wird. Für das Deployment aller Contracts wird eine funktionsfähige Truffle-Umgebung, sowie der Zugriff auf einen Ethereum-Knoten, wie beispielsweise Ganache benötigt. 

### Schritt 1: Contract-Deployment
Im ersten Schritt werden alle benötigen Contracts deployed. Das Script "2_deploy_ENS.js" deployed die ENS-Registry (ENS.sol), den Registrar für die Top-Level-Domain (FIFSRegistrar.sol), den Registrar (ReverseRegistrar.sol) für die Reverse-Domain, den Resolver (PublicResolver.sol) für die Beantwortung von Ressourcen-Anfragen. Am Schluss werden die Domains "planets.eth" und "addr.reverse" registriert.

Das Skript "3_deploy_Planets.js", deployed einen Demo-Contract und registriert diesem unter dem Namen "earth.planets.eth" und dessen Adressen in der Domain "addr.reverse" unter dem Namen "earth.planets.eth". Ebenfalls wird die Contract-ABI im Format zlib gepackt und als Ressource der Domain zugeordnet.

Das gesamte Deployment wird gestartet mit dem Befehl `truffle migrate --reset`

### Schritt 2: Zugriff auf „earth.planets.eth“
Der Befehl `npm install` installiert alle notwendigen Libraries. Für einen einfachen Zugriff auf ENS und die Ressourcen einer Domain werden die Libraries ethereum-ens und web3 verwendet. Vor dem Start ist die Adresse der ENS-Registry im Skript zu ergänzen (s. *const ensAddr*). Das Skript wird mit dem Befehl `node scripts\call_Earth.v1.js` gestartet.

Als erstes ermittelt das Script Adresse und ABI der Sub-Domain "earth.planet.eth" und erstellt damit einen Client für den Contract-Zugriff. Im zweiten Schritt wird der für die Adresse hinterlegte Domain-Name ermittelt und ausgegeben.

Die Library „ethereum-ens“ vereinfacht den Zugriff auf die ENS-Registry. Alternativ zeigt das Skript "scripts\call_Earth.v2.js" den Zugriff auf die ENS-Registry ohne die Verwendung von ethereum-ens. Das Skript wird gestartet mit `truffle exec scripts\call_Earth.v2.js`

### Weitere Quellen
+ ENS-Dokumentation: https://docs.ens.domains/en/latest/
+ ENS-Spezifikation: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-137.md
+ ENS-Contract-Implementierung: https://github.com/ensdomains/ens
+ Truffle-Framework : https://truffleframework.com/
