#!/usr/bin/env python3
"""
EA Golden Engel Landing Page - Vercel Deployment
Optimizado para Vercel con Flask
"""

from flask import Flask, render_template, jsonify
import random
import json
from datetime import datetime, timedelta
import os

# Inicializar Flask app
app = Flask(__name__)

# Sistema de reseñas
REVIEWS = [
    # Reseñas positivas
    {"name": "Michael Rodriguez", "rating": 5, "comment": "Excelente EA ENGEL para oro. El trailing stop funciona perfectamente en H1.", "days_ago": 12},
    {"name": "Sarah Chen", "rating": 5, "comment": "La gestión por porcentaje de cuenta es genial. MetaQuant Studio hizo un gran trabajo.", "days_ago": 8},
    {"name": "David Thompson", "rating": 4, "comment": "Funciona perfectamente en H1 con ICMarkets. He visto mejoras constantes.", "days_ago": 15},
    {"name": "Elena Kozlova", "rating": 5, "comment": "Después de 3 meses, puedo confirmar que EA ENGEL-Xau 3.0 es sólido y confiable.", "days_ago": 22},
    {"name": "James Wilson", "rating": 4, "comment": "El filtro de spread realmente marca la diferencia. Muy profesional.", "days_ago": 6},
    {"name": "Maria Santos", "rating": 5, "comment": "Por fin un EA que entiende el comportamiento del oro en H1. Excelente trabajo.", "days_ago": 18},
    {"name": "Robert Kim", "rating": 4, "comment": "Los backtests M1 tick by tick coinciden con los resultados reales. Muy confiable.", "days_ago": 11},
    {"name": "Anna Petrov", "rating": 5, "comment": "Llevo 2 meses usándolo y los resultados superan mis expectativas.", "days_ago": 9},
    {"name": "Carlos Mendez", "rating": 4, "comment": "La gestión de riesgo sin martingala es muy inteligente. Se nota la experiencia.", "days_ago": 25},
    {"name": "Lisa Zhang", "rating": 5, "comment": "Perfecto para traders que buscan consistencia en XAUUSD sin grandes riesgos.", "days_ago": 14},
    {"name": "Ahmed Hassan", "rating": 4, "comment": "El enfoque especializado en XAUUSD H1 realmente funciona. Muy satisfecho.", "days_ago": 7},
    {"name": "Jennifer Lee", "rating": 5, "comment": "La configuración es simple pero los resultados son sofisticados. Recomendado.", "days_ago": 20},
    {"name": "Marco Rossi", "rating": 4, "comment": "He probado muchos EAs, este es diferente. Se nota el trabajo de MetaQuant Studio.", "days_ago": 13},
    {"name": "Yuki Tanaka", "rating": 5, "comment": "El panel de estadísticas en tiempo real es muy útil. Muy recomendado.", "days_ago": 16},
    {"name": "Thomas Mueller", "rating": 4, "comment": "Funciona especialmente bien en H1 con ICMarkets. Los drawdowns son controlados.", "days_ago": 10},
    {"name": "Priya Sharma", "rating": 5, "comment": "La especialización en oro se nota en cada operación. Muy recomendado.", "days_ago": 19},
    {"name": "Alex Petersen", "rating": 4, "comment": "El soporte del desarrollador es excelente y el EA cumple lo que promete.", "days_ago": 5},
    {"name": "Fatima Al-Rashid", "rating": 5, "comment": "Tres meses de uso constante con EA ENGEL-Xau 3.0 y resultados consistentes.", "days_ago": 24},
    
    # Reseñas neutrales
    {"name": "John Anderson", "rating": 3, "comment": "EA ENGEL funciona bien en H1, aunque requiere paciencia para ver resultados.", "days_ago": 17},
    {"name": "Sophie Martin", "rating": 3, "comment": "Buen EA, pero como siempre recomiendo hacer backtesting propio con ICMarkets.", "days_ago": 21},
    {"name": "Ivan Volkov", "rating": 3, "comment": "Resultados decentes en XAUUSD. La configuración inicial requiere atención.", "days_ago": 12},
    {"name": "Rachel Green", "rating": 3, "comment": "Funciona según las especificaciones. Nada extraordinario pero sólido.", "days_ago": 8},
    {"name": "Luis Garcia", "rating": 3, "comment": "Buen EA ENGEL, aunque los spreads altos pueden afectar el rendimiento.", "days_ago": 26},
    {"name": "Emma Johnson", "rating": 3, "comment": "Cumple con lo básico en H1. Los resultados varían según las condiciones del mercado.", "days_ago": 15},
    {"name": "Pierre Dubois", "rating": 3, "comment": "Correcto para lo que es. La documentación podría ser más detallada.", "days_ago": 9},
    {"name": "Olga Smirnova", "rating": 3, "comment": "Funciona bien en demo con XAUUSD. Aún evaluando en cuenta real.", "days_ago": 4},
    {"name": "Hassan Ali", "rating": 3, "comment": "Decente para principiantes, aunque requiere entender bien el mercado del oro.", "days_ago": 23},
    {"name": "Victoria Chang", "rating": 3, "comment": "Los resultados son consistentes con las expectativas en timeframe H1.", "days_ago": 11},
    {"name": "Gabriel Silva", "rating": 3, "comment": "Buen EA ENGEL, pero siempre importante mantener expectativas realistas.", "days_ago": 18},
    {"name": "Ingrid Larsson", "rating": 3, "comment": "Funciona como se describe en H1. La paciencia es clave con este tipo de estrategias.", "days_ago": 6}
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/reviews')
def get_reviews():
    # Seleccionar entre 8-12 reseñas aleatorias
    num_reviews = random.randint(8, 12)
    selected_reviews = random.sample(REVIEWS, num_reviews)
    
    # Agregar fechas calculadas
    for review in selected_reviews:
        review_date = datetime.now() - timedelta(days=review['days_ago'])
        review['date'] = review_date.strftime('%d/%m/%Y')
    
    return jsonify(selected_reviews)

@app.route('/download')
def download():
    return jsonify({"message": "Download functionality would be implemented here"})

# Desactivar logging de Flask para producción
import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

if __name__ == "__main__":
    app.run(debug=False)
