
export interface FormValidation {

    loader: boolean;
    requiredStyle: Map<string, string>;
    requiredFields: Map<string, string>;

    validFields(): boolean;
    addInputFieldRequired(field: string): void;
    clearInputFieldRequired(field: string): void;
    changeTextFieldRequired(field: string, value: string, cssClass: string): void;
    clearAllInputFieldsRequired(): void;

}