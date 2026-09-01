#!/usr/bin/env python3
"""
Calculadora de coste del bot, con datos reales medidos (septiembre 2026).

    python3 costos.py                 # escenario base
    python3 costos.py 1000 8          # 1000 conversaciones/mes, 8 mensajes cada una

Fuentes de los numeros:
  - Volumen: contado dia por dia en la cuenta de Marcelo (356 nuevas en 15 dias).
  - Ops por mensaje: medido en [BOT] Cool Drive (372 ops / 72 ejecuciones = 5,2
    de promedio incluyendo runs que fallaron; 7 en un turno completo sano).
  - Precios Anthropic por millon de tokens. Verificar los vigentes.
"""
import sys

CONV_MES  = float(sys.argv[1]) if len(sys.argv) > 1 else 712   # 356 en 15 dias
MSG_CONV  = float(sys.argv[2]) if len(sys.argv) > 2 else 6     # flujo de calificacion y ruteo

SYSTEM_TOK = 3175    # cerebro de Paula
RESUMEN_TOK = 250    # memoria por resumen (400 chars) + contexto del turno
SALIDA_TOK  = 200
OPS_MSG     = 7      # webhook, getrecord, IA, parse, guardar, sleep, enviar
OPS_FU_MES  = 540    # escenario de seguimientos cada 4h

MODELOS = {"claude-opus-5": (5.0, 25.0), "claude-sonnet-5": (3.0, 15.0),
           "claude-haiku-4-5": (1.0, 5.0)}
PLANES = [("Free", 1000, 0), ("Core", 10000, 11), ("Pro", 40000, 19), ("Teams", 80000, 34)]

print(f"Volumen: {CONV_MES:.0f} conversaciones/mes x {MSG_CONV:.0f} mensajes\n")

# --- Make ---
ops = CONV_MES * MSG_CONV * OPS_MSG + OPS_FU_MES
plan = next((p for p in PLANES if p[1] >= ops), ("Enterprise", 0, 0))
print(f"MAKE\n  operaciones/mes : {ops:,.0f}")
print(f"  plan necesario  : {plan[0]} ({plan[1]:,} ops) ~ ${plan[2]}/mes\n")

# --- IA, con memoria por resumen (modelo Cool Drive) ---
print("IA (memoria por resumen, el prompt no crece con la conversacion)")
print(f"  {'modelo':<18}{'x conversacion':>15}{'x mes':>10}")
print("  " + "-"*43)
for m, (pin, pout) in MODELOS.items():
    escritura = SYSTEM_TOK/1e6 * pin * 2                       # 1 escritura de cache por conversacion
    lectura   = (MSG_CONV-1) * SYSTEM_TOK/1e6 * pin * 0.1
    entrada   = MSG_CONV * RESUMEN_TOK/1e6 * pin
    salida    = MSG_CONV * SALIDA_TOK/1e6 * pout
    conv = escritura + lectura + entrada + salida
    print(f"  {m:<18}{'$'+format(conv,'.4f'):>15}{'$'+format(conv*CONV_MES,'.0f'):>10}")

# --- comparacion contra historial completo ---
pin, pout = MODELOS["claude-sonnet-5"]
hist_tok = 1500   # historial acumulado de 6.000 caracteres
extra = MSG_CONV * hist_tok/1e6 * pin * CONV_MES
print(f"\n  Guardar historial completo en vez de resumen sumaria ~${extra:.0f}/mes en Sonnet 5.")

print(f"""
TOTAL MENSUAL (Sonnet 5 + Make {plan[0]})
  Make          ~${plan[2]}
  IA            ~${(lambda p: (SYSTEM_TOK/1e6*p[0]*2 + (MSG_CONV-1)*SYSTEM_TOK/1e6*p[0]*0.1 + MSG_CONV*RESUMEN_TOK/1e6*p[0] + MSG_CONV*SALIDA_TOK/1e6*p[1])*CONV_MES)(MODELOS['claude-sonnet-5']):.0f}
  WhatsApp API   aparte, solo si se usa numero nuevo
""")
