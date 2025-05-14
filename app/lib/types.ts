export type Expense = {
  id: string
  amount: number
  category: string
  description: string
  date: Date
}

export type ExpenseFormData = Omit<Expense, 'id' | 'date'> & {
  date: string
}

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transportation',
  'Housing',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Education',
  'Other'
] as const

export type DateRange = {
  from: Date | undefined
  to: Date | undefined
}

export type ChatMessage = {
  autor: 'usuario' | 'agente';
  texto: string;
  timestamp?: string;
};

export type ChatSession = {
  id: string;
  nombre: string;
  correo: string;
  sector: string;
  servicios: string;
  mensajes: ChatMessage[];
  createdAt: Date;
};

export type TestDiagnostico = {
  sector: string;
  ia: string;
  impacto: string;
  formacion: string;
  madurez: string;
  resultado: string[];
  createdAt: Date;
};