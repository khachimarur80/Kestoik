// src/i18n.js
import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n)

const messages = {
  en: {
    message: {
      today: 'Today',
      campaigns: 'Campaigns',
      progress: 'Progress',
      logs: 'Logs',
      objectives: 'Objectives',
      review: 'Review',
      newLog: 'New Log',
      description: 'Description',
      availableTime: 'Available Time',
      usedTime: 'Used Time',
      bedTime: 'Bed Time',
      errorMargin: 'Error Margin',
      newObjective: 'New Objective',
      configuration: 'Configuration',
      objective: 'Objective',
      totalTime: 'Total Time',
      activities: 'Activities',
      activity: 'Activity',
      accuracy: 'Accuracy',
      satisfaction: 'Satisfaction',
      performance: 'Performance',
      observations: 'Observations',
      evaluation: 'Evaluation',
      finishDay: 'Finish Day',
      startDay: 'Start Day',
      view: 'View',
      score: 'Score',
      start: 'Start',
      end: 'End',
      workedCampaigns: 'Worked Campaigns',
      close: 'Close',
      min: 'min',
    }
  },
  ja: {
    message: {
      usedTime: '使用時間',
      today: '今日',
      campaigns: 'キャンペーン',
      progress: '進捗',
      logs: 'ログ',
      objectives: '目標',
      review: 'レビュー',
      newLog: '新規ログ',
      description: '説明',
      availableTime: '利用可能な時間',
      bedTime: '就寝時間',
      errorMargin: '誤差マージン',
      newObjective: '新しい目標',
      configuration: '設定',
      objective: '目標',
      totalTime: '合計時間',
      activities: 'アクティビティ',
      activity: 'アクティビティ',
      accuracy: '精度',
      satisfaction: '満足度',
      performance: 'パフォーマンス',
      observations: '観察',
      evaluation: '評価',
      finishDay: '終了日',
      startDay: '朝始',
      view: '表示',
      score: 'スコア',
      start: '開始',
      end: '終了',
      workedCampaigns: '作業したキャンペーン',
      close: '閉じる',
      min: '分',
    }
  },
  es: {
    message: {
      usedTime: 'Tiempo invertido',
      min: 'min',
      today: 'Hoy',
      campaigns: 'Campañas',
      progress: 'Progreso',
      logs: 'Registros',
      objectives: 'Objetivos',
      review: 'Revisión',
      newLog: 'Nuevo Registro',
      description: 'Descripción',
      availableTime: 'Tiempo Disponible',
      bedTime: 'Hora de Acostarse',
      errorMargin: 'Margen de Error',
      newObjective: 'Nuevo Objetivo',
      configuration: 'Configuración',
      objective: 'Objetivo',
      totalTime: 'Tiempo Total',
      activities: 'Actividades',
      activity: 'Actividad',
      accuracy: 'Precisión',
      satisfaction: 'Satisfacción',
      performance: 'Rendimiento',
      observations: 'Observaciones',
      evaluation: 'Evaluación',
      finishDay: 'Finalizar Día',
      startDay: 'Comenzar Día',
      view: 'Ver',
      score: 'Puntuación',
      start: 'Iniciar',
      end: 'Finalizar',
      workedCampaigns: 'Campañas Trabajadas',
      close: 'Cerrar'
    }
  }


}

const i18n = new VueI18n({
  locale: 'en',
  messages,
})

export default i18n;
