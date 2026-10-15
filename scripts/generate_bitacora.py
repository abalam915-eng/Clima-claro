from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "bitacora-programacion-ia.pdf"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

PAGE_W, PAGE_H = letter
MARGIN_X = 17 * mm
MARGIN_TOP = 16 * mm
MARGIN_BOTTOM = 15 * mm


def draw_page(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#C8D8D5"))
    canvas.setLineWidth(0.6)
    canvas.line(MARGIN_X, 12 * mm, PAGE_W - MARGIN_X, 12 * mm)
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(colors.HexColor("#5F716F"))
    canvas.drawString(MARGIN_X, 7.5 * mm, "Clima Claro · Bitácora de programación con IA")
    canvas.drawRightString(PAGE_W - MARGIN_X, 7.5 * mm, f"Página {doc.page}")
    canvas.restoreState()


doc = BaseDocTemplate(
    str(OUTPUT),
    pagesize=letter,
    leftMargin=MARGIN_X,
    rightMargin=MARGIN_X,
    topMargin=MARGIN_TOP,
    bottomMargin=MARGIN_BOTTOM,
    title="Bitácora de programación con IA - Clima Claro",
    author="Angel Guadalupe Balam Moo",
)

frame = Frame(
    MARGIN_X,
    MARGIN_BOTTOM,
    PAGE_W - (2 * MARGIN_X),
    PAGE_H - MARGIN_TOP - MARGIN_BOTTOM,
    leftPadding=0,
    rightPadding=0,
    topPadding=0,
    bottomPadding=0,
)
doc.addPageTemplates(PageTemplate(id="main", frames=[frame], onPage=draw_page))

styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="TitleCustom",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=23,
        textColor=colors.HexColor("#173F3A"),
        alignment=TA_LEFT,
        spaceAfter=4 * mm,
    )
)
styles.add(
    ParagraphStyle(
        name="SubtitleCustom",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#5F716F"),
        spaceAfter=5 * mm,
    )
)
styles.add(
    ParagraphStyle(
        name="HeadingCustom",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=14,
        textColor=colors.HexColor("#173F3A"),
        spaceBefore=2.5 * mm,
        spaceAfter=2 * mm,
    )
)
styles.add(
    ParagraphStyle(
        name="BodyCustom",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=8.3,
        leading=11.2,
        textColor=colors.HexColor("#243C39"),
        spaceAfter=2 * mm,
    )
)
styles.add(
    ParagraphStyle(
        name="PromptCustom",
        parent=styles["BodyText"],
        fontName="Helvetica-Oblique",
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor("#173F3A"),
        leftIndent=4 * mm,
        rightIndent=3 * mm,
        borderColor=colors.HexColor("#B9E4DB"),
        borderWidth=0,
        borderPadding=(2 * mm, 2.5 * mm, 2 * mm, 2.5 * mm),
        backColor=colors.HexColor("#EAF5F2"),
        spaceAfter=2 * mm,
    )
)
styles.add(
    ParagraphStyle(
        name="SmallCustom",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=7.4,
        leading=9.5,
        textColor=colors.HexColor("#5F716F"),
        spaceAfter=2 * mm,
    )
)


def p(text, style="BodyCustom"):
    return Paragraph(text, styles[style])


story = [
    p("Bitácora de programación con IA", "TitleCustom"),
    p(
        "Proyecto: <b>Clima Claro</b> &nbsp;·&nbsp; Autor: <b>Angel Guadalupe Balam Moo</b> "
        "&nbsp;·&nbsp; Herramienta principal: <b>OpenAI Codex</b>",
        "SubtitleCustom",
    ),
    p("Contexto del proyecto", "HeadingCustom"),
    p(
        "Se desarrolló una aplicación web que usa las API de geocodificación y pronóstico de "
        "Open-Meteo. La aplicación permite buscar una ciudad, consultar el clima actual y ver "
        "un pronóstico de siete días. Codex se utilizó para analizar la consigna, escribir y "
        "depurar el código, preparar pruebas y documentar el proyecto. Las dos últimas entradas "
        "de esta bitácora son instrucciones textuales de la consigna adjunta que se usaron como "
        "subprompts de trabajo; no se presentan como mensajes escritos por separado.",
    ),
    p("Prompts e iteraciones", "HeadingCustom"),
]

entries = [
    (
        "1. Análisis del encargo",
        "Analiza el documento y dime que es lo que entiendes que hay que hacer",
        "La IA separó la actividad en aplicación, repositorio, README, bitácora, evidencia de "
        "GitHub y demostración. También señaló las condiciones de seguridad para las claves.",
        "Sí funcionó a la primera. Solo fue necesario confirmar que la demostración sería "
        "responsabilidad del estudiante.",
    ),
    (
        "2. Inicio de la implementación",
        "Bien, Sigue las instrucciones del documento excepto el inciso 6, pues ese me tengo que encargar yo",
        "La IA eligió una aplicación web de clima con Open-Meteo, una API gratuita que no "
        "requiere clave, y propuso dividir el desarrollo en varios commits.",
        "La instrucción fue suficiente para iniciar, pero se revisó primero la identidad de Git "
        "para evitar que los commits quedaran atribuidos a otra persona.",
    ),
    (
        "3. Confirmación del alcance",
        "Esta bien, Bien, Sigue las instrucciones del documento excepto el inciso 6, pues ese me tengo que encargar yo",
        "La IA implementó la interfaz, las peticiones a la API, los estados de error, las pruebas "
        "y la documentación, manteniendo fuera del alcance el video o presentación.",
        "No se necesitó cambiar el objetivo. Se mejoraron los textos en español y se añadió un "
        "botón de reintento para que los errores fueran recuperables.",
    ),
    (
        "4. Requisito textual usado como subprompt",
        "Desarrolla una aplicación pequeña (web o móvil) que consuma al menos una API externa. Puedes elegir la API y el tema.",
        "La respuesta fue una app web sin framework llamada Clima Claro. Se usó una API de "
        "geocodificación para obtener coordenadas y otra de pronóstico para los datos del clima.",
        "La primera propuesta funcional necesitó validación de la estructura de respuesta y "
        "mensajes claros cuando una ciudad no existe.",
    ),
    (
        "5. Requisito textual usado como subprompt",
        "Manejar errores (sin conexión, respuesta vacía, límite de peticiones).",
        "La IA creó mensajes distintos para falta de conexión, tiempo agotado, respuesta vacía, "
        "límite HTTP 429 y errores generales. También añadió reintento y detección de cambios de red.",
        "No quedó completo a la primera: una prueba falló porque el mensaje decía 'limite' sin "
        "acento mientras la prueba esperaba 'límite'. Se corrigió el texto y después pasaron las "
        "seis pruebas.",
    ),
]

for title, prompt, response, adjustment in entries:
    story.extend(
        [
            p(title, "HeadingCustom"),
            p(f"<b>Prompt:</b> “{prompt}”", "PromptCustom"),
            p(f"<b>Respuesta obtenida:</b> {response}"),
            p(f"<b>Resultado y ajustes:</b> {adjustment}"),
        ]
    )

story.extend(
    [
        Spacer(1, 1 * mm),
        p("Error de la IA detectado", "HeadingCustom"),
        p(
            "Durante la primera ejecución de las pruebas automatizadas, una prueba falló por una "
            "inconsistencia entre el texto esperado y el texto generado para el límite de "
            "peticiones. El programa mostraba “limite” y la prueba exigía “límite”. Aunque no "
            "impedía la petición a la API, demostraba que el resultado de la IA no debía aceptarse "
            "sin revisión. Se corrigió la cadena en <font name='Courier'>weather-utils.js</font> "
            "y se volvió a ejecutar <font name='Courier'>npm test</font>; las seis pruebas pasaron.",
        ),
        p("Qué aprendí", "HeadingCustom"),
        p(
            "Aprendí que una petición clara mejora mucho el resultado, pero no sustituye la "
            "verificación. También aprendí a separar la lógica en funciones pequeñas, validar los "
            "datos antes de mostrarlos y tratar cada error con un mensaje útil. Consultar la "
            "documentación oficial de la API evitó depender de parámetros inventados o desactualizados.",
        ),
        p("Qué haría distinto la próxima vez", "HeadingCustom"),
        p(
            "La próxima vez dividiría desde el inicio el trabajo en prompts más específicos: uno "
            "para la estructura, otro para la API, otro para errores y otro para pruebas. También "
            "pediría criterios de aceptación antes de generar código y realizaría una prueba "
            "manual después de cada cambio importante, no únicamente al final.",
        ),
        Spacer(1, 2 * mm),
        Table(
            [[
                p("Verificación final", "SmallCustom"),
                p("6 pruebas automatizadas aprobadas · claves expuestas: ninguna · historial: varios commits", "SmallCustom"),
            ]],
            colWidths=[32 * mm, 130 * mm],
            style=TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F3F4EE")),
                    ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#C8D8D5")),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 8),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                    ("TOPPADDING", (0, 0), (-1, -1), 6),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ]
            ),
        ),
    ]
)

doc.build(story)
print(OUTPUT)
