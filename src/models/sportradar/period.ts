
export enum PeriodType {
    Quarter = "quarter"
}

export interface Period {
    id: string
    number: number
    sequence: number
    type: PeriodType
}
