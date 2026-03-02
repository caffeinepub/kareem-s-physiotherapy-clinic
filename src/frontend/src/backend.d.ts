import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface AppointmentRequest {
    id: bigint;
    status: string;
    name: string;
    email: string;
    preferredDatetime: string;
    notes: string;
    timestamp: Time;
    phone: string;
    reason: string;
}
export type Time = bigint;
export interface backendInterface {
    deleteAppointmentRequest(id: bigint): Promise<boolean>;
    getAllAppointmentRequests(): Promise<Array<AppointmentRequest>>;
    getAppointmentRequest(id: bigint): Promise<AppointmentRequest>;
    submitAppointmentRequest(name: string, phone: string, email: string, preferredDatetime: string, reason: string): Promise<bigint>;
    updateAppointmentStatus(id: bigint, status: string, notes: string): Promise<boolean>;
}
