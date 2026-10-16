# BRO//OS - BIG BANG 2.0

El final era el principio. Una expansión local para el simulador de producción,
bugs y decisiones cuestionables.

## Jugar

Abre `BRO-OS-BIG-BANG.html` en tu navegador. No necesita instalar paquetes,
crear cuentas, levantar servidores ni configurar claves de API. Activa JavaScript.
El archivo incluye todo lo necesario. El juego no hace solicitudes externas.

## Traer tu partida anterior SIN empezar de cero

1. Abre el juego original `BRO-OS.html` y entra en Ajustes > Exportar partida.
2. Guarda ese JSON antes de cerrar, mover o eliminar el archivo antiguo.
3. Abre `BRO-OS-BIG-BANG.html` y pulsa Importar mi partida anterior.
4. Selecciona tu JSON y confirma Importar y continuar.

También puedes importar desde Ajustes > Importar v1 / v2. Se conservaran los
servidores y sus niveles, créditos, laboratorio, contratos, logros, experiencia,
contadores y preferencias. Los nuevos sistemas empiezan a cero.

La deteccion automatica de una partida v1 solo funciona si el navegador permite
acceder al mismo almacenamiento. NO dependas de ella al abrir un archivo diferente:
exportar e importar JSON es la forma explicita de trasladar la partida.

BIG BANG usa `bro-os-bigbang-v2`. Nunca escribe en el guardado original
`bro-os-save-v1`. No reemplaces tu archivo antiguo antes de exportar su partida.

## Tu siguiente objetivo

Si ya tienes los servidores y logros de la primera versión:

- Entra en Drones y prepara la automatización.
- Entra en Jefes. Derrota, en orden, a La migración sin backup, El viernes eterno
  y CEUTA PRIME. Piden 6, 8 y 12 servidores respectivamente.
- Completa los seis contratos del ciclo y derrota a CEUTA PRIME.
- En Big Bang, revisa lo que conservaras, exporta una copia y confirma el salto.

Los jefes tienen tres fases: eliminar bugs, mantener la estabilidad sin
interrupciones y aplicar parches. Todos los metodos de eliminacion de bugs
cuentan: clics, hotfix, rollback, soporte del combate y drones.

El parche seguro cuesta créditos y necesita estabilidad >=65% y un máximo de
3 bugs. El parche sin tests no cuesta créditos, pero genera tres bugs, resta
12 puntos de estabilidad y tiene una recarga mayor.

Si se agota el tiempo de un jefe, pierdes un 10% de tus créditos y 12 puntos de
estabilidad. El reintento se habilita tras 45 segundos de juego. La retirada
voluntaria no devuelve la entrada y exige esperar 20 segundos, sin penalizacion
adicional. Si la estabilidad llega a cero, el rescate habitual cuesta el 40%
de tus créditos y restaura el 65% de estabilidad. No pierdes servidores ni mejoras.

## Que hace un Big Bang

Conserva logros, XP, historial de jefes, fragmentos y mejoras permanentes.
Reinicia créditos, servidores, mejoras del laboratorio, contratos, drones,
enemigos y jefes del ciclo. Los secretos vuelven a estar disponibles.

Cada salto empieza con 3 servidores, 1.250 CR y 92% de estabilidad, más los
beneficios permanentes que hayas comprado. Cada Big Bang aporta +10% de
producción base y aumenta un 12% el daño continuo de los bugs, hasta +150%.

Recibes fragmentos solo al confirmar el salto:

3 de base + 1 por cada 25.000 créditos generados (máximo 8)
+ 2 por jefe derrotado + bonificacion de la dimensión.

No es necesario ahorrar los créditos: cuenta lo generado durante el ciclo.
Los contratos y otros premios monetarios también cuentan como créditos generados.

Hay un objetivo concreto: completar cinco Big Bangs. Al conseguirlo se registra
la victoria de la expansión y el logro Arquitecto del imposible. Puedes seguir
en modo libre; no se desbloquean dimensiones adicionales despues de las cuatro
incluidas en esta versión.

## Dimensiones

| Dimension | Disponible al alcanzar | Reglas principales |
| --- | --- | --- |
| Localhost original | 0 Big Bangs | Reglas originales; producción x1. |
| República de Ceuta | 1 Big Bang | Produccion x1,6; más intrusiones; 45% de duplicacion en intrusiones naturales; +2 fragmentos al saltar. |
| Viernes eterno | 2 Big Bangs | Produccion x2,2; despliegues 35% más baratos, pero restan 6 de estabilidad; +4 fragmentos al saltar. |
| El vacío de staging | 3 Big Bangs | Produccion x2,8; sin recuperación pasiva, ni por refrigeracion; +6 fragmentos al saltar. |

El destino se elige al confirmar cada Big Bang. No se cambia a mitad de ciclo.
Las reglas y los multiplicadores completos aparecen en la pantalla Big Bang.

## Drones

Pato centinela: elimina un bug completo por turno, incluidos los reforzados.
Gana 35 CR por cada eliminacion. No cobra mantenimiento.

SRE de guardia: repara por debajo del umbral elegido. Cada turno de reparacion
cuesta 40 CR. Puedes elegir 70%, 85%, 95% o 100% como umbral.

Becario autónomo: paga la mejora del servidor de menor nivel, hasta nivel 5.
Nunca despliega servidores nuevos.

El SRE y el becario respetan tu reserva de créditos. Si no tienen presupuesto,
esperan. Tus acciones manuales SI pueden gastar por debajo de la reserva.
Los niveles de drones son del ciclo actual; no se conservan al saltar.

## Mejoras permanentes

Se compran con fragmentos, no con créditos:

- Memoria del universo: +15% de producción por nivel.
- Capital de otra vida: +500 CR iniciales por nivel, desde el siguiente ciclo.
- Firewall ancestral: -6% de daño continuo de bugs por nivel. No frena ataques directos de jefes.
- El pato es eterno: concede un Pato centinela de nivel 1 ahora y al iniciar cada ciclo.

Los efectos de producción de los Big Bangs y de Memoria del universo se suman
entre si, y luego multiplican la producción ajustada por estabilidad y dimensión.

## Logros y controles

Hay 17 logros: los nueve originales y ocho nuevos. Permanecen entre ciclos.

D: desplegar. F: hotfix. C: cafe. X: caos. Espacio: pausar/reanudar.
Barra /: enfocar la terminal. Los atajos no actuan mientras escribes en un campo.

Terminal simulada: help, status, deploy, purge, fix, coffee, rollback, chaos,
lab, map, drones, bosses, prestige, achievements, pause, resume, sound, clear.
Los secretos originales siguen funcionando: duck, bro y sudo make it work.
El comando prestige abre la pantalla; nunca ejecuta un reinicio automáticamente.

## Guardado, copias y privacidad

Autoguardado cada 3 segundos de simulación y al salir de la pagina cuando el
navegador lo permite. Exporta copias JSON regularmente; borrar datos del navegador
puede borrar la partida local.

Antes de un Big Bang se guarda una copia local del ciclo anterior. Puedes
obtenerla desde Ajustes > Descargar copia anterior. También se intenta crear
una copia antes de importar otra partida o de borrar el progreso. Solo se
conserva la copia local más reciente: exporta las que quieras archivar.

Si no se puede guardar la copia local del Big Bang, el juego no salta en silencio:
te pide exportar un JSON y marcar una confirmación adicional para continuar.

Importar NO reinicia tu imperio. Confirmar Big Bang SI reinicia la economia del
ciclo, a cambio de progreso permanente. Borrar TODO el progreso elimina también
logros, fragmentos y prestigio; no da ninguna recompensa.

No hay progreso offline. Cerrar la app, ocultar la pestaña, pausar o abrir un
cuadro de dialogo detiene ingresos, automatizaciones y temporizadores de jefes.
Cambiar entre pantallas del juego no pausa la simulación.

No hay servidores reales, pagos reales, IA remota, seguimiento, conexiones con
AutoDrop/RRForms ni ejecución de comandos en tu ordenador.

## Código fuente

`src/index.html`, `src/styles.css` y `src/app.js` son editables.
Puedes abrir `src/index.html` directamente para trabajar con los archivos separados.
El motor original se conserva bajo funciones legacy cuando se reutiliza, y la
expansión proporciona las nuevas reglas, pantallas y migración de datos.

Para regenerar el archivo unico, desde la raiz del paquete:

    python tools/bundle.py

El empaquetador solo utiliza la biblioteca estandar de Python. No se necesitan
npm, Vite ni un proceso de compilacion para jugar.

## Pruebas

Se verificaron 48 comprobaciones de integracion: importación v1, datos invalidos,
conservación del progreso, drones y presupuestos, reglas dimensionales, fases,
recompensas no duplicables, prestigio, copias, rescate, exportación JSON y objetivo
de cinco ciclos. También se probaron estrategias legales para los tres jefes,
la confirmación sin almacenamiento, pausa y ausencia de desbordamiento horizontal
a 320, 390, 768, 1024 y 1440 pixeles.

Las pruebas se ejecutaron en Chromium de escritorio. No son pruebas en dispositivos
móviles físicos ni garantizan el comportamiento de todos los navegadores.
El entorno de ejecución bloquea la navegación del navegador: se renderizo el HTML
con set_content y se probo la API de almacenamiento con un objeto en memoria.
También se comprobo que la aplicacion no lanza errores cuando el almacenamiento
esta bloqueado. Conviene verificar guardar, cerrar y volver a abrir en tu navegador.

`tests/integration.py` contiene las pruebas reproducibles (requiere Python,
Playwright y un navegador Chromium disponible). Usa almacenamiento aislado y
genera sus propios datos ficticios; no accede a tus partidas.

    python tests/integration.py

Puedes indicar el ejecutable del navegador con BROWSER_EXECUTABLE si fuese
necesario. El informe de la comprobación realizada esta en `tests/resultados.json`.
