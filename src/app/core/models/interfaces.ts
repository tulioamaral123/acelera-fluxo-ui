export interface AuthResponse {
  token: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export type TipoPonto = 'ENTRADA' | 'SAIDA';

export interface PontoRegistroDTO {
  id?: number;
  tipo: TipoPonto;
  dataHora?: string;
  observacao?: string;
}

export interface MetricsDTO {
  totalPontosHoje: number;
  totalPontosSemana: number;
  ultimaEntrada?: string;
  ultimaSaida?: string;
  pontoAberto: boolean;
  registrosHoje: PontoRegistroDTO[];
}

export interface UserSettingsDTO {
  jiraDomain?: string;
  jiraEmail?: string;
  jiraToken?: string;
  bitbucketWorkspace?: string;
  bitbucketToken?: string;
  pontoApiKey?: string;
  googleClientId?: string;
  googleClientSecret?: string;
  googleCalendarId?: string;
  googleRefreshToken?: string;
}

export interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    status: { name: string; statusCategory: { colorName: string } };
    priority: { name: string; iconUrl: string };
    updated: string;
    timetracking?: {
      originalEstimate?: string;
      remainingEstimate?: string;
      timeSpent?: string;
      timeSpentSeconds?: number;
    };
    worklog?: {
      total: number;
      worklogs: Array<{
        author: { displayName: string };
        timeSpent: string;
        timeSpentSeconds: number;
        started: string;
        comment?: any;
      }>;
    };
  };
}

export interface JiraResponse {
  issues: JiraIssue[];
  total: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;       // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string;   // HH:mm
  allDay: boolean;
  colorHex: string;
}

export interface BitbucketRepo {
  slug: string;
  name: string;
  description?: string;
  language?: string;
  updated_on: string;
  links: { html: { href: string } };
}

export interface BitbucketResponse {
  values: BitbucketRepo[];
  pagelen: number;
  size: number;
}
