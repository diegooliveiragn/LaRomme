export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return 'Sob Consulta';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}
