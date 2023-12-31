declare module '@app-models' {
  import { CheckListType } from '@app-types';
  interface IPermission {
    permission_id: number;
    name: string;
    action: string;
    subjection: string;
  }
IUser
  interface IPreference {
    termsAndCondition: string;
  }

  interface IPreferenceUpdate {
    termsAndCondition: string;
  }

  interface IUserUpdate {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password?: string | null;
    roleId: number;
    id: number;
  }

  interface IRole {
    role_id: number;
    name: string;
    slug: string;
  }
  interface IUser {
    id: number;
    code: string;
    firstName: string;
    lastName: string;
    username: string;
    companyName: string;
    designation: string;
    password: string;
    rawPassword: string;
    email: string;
    phone: string;
    gender: string;
    profileImageUrl: string;
    active: boolean;
    enabled: boolean;
    loginToken: string;
    gatewayId: string;
    loginDate: Date;
    contacts: IContact[];
    partner: IPartner;
    partnerId: number;
    roles: IRole[];
    createdAt: Date;
    updatedAt: Date;
    active: boolean;
    accountType: string | null;
  }

  interface UploadResult {
    file: {
      url: string;
      name: string;
    };
    uploadStartTime: Date | null;
    busboyFinishTime: Date | null;
    s3UploadFinishTime: Date | null;
  }

  interface IContact {
    id: number;
    label: string;
    address: string;
    city: string;
    district: string;
    postalCode: string;
    state: string;
    country: string;
    customer: ICustomer;
    customerId: number;
    user: IUser;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
  }

  interface IItem {
    id: number;
    name: string;
    type: string;
    buyingPrice: number;
    sellingPrice: number;
    unit: string;
    quantity: number;
    description: string;
    partNumber: string;
    active: boolean;
    slug?: string;
  }

  interface IState {
    id: number;
    name: string;
    alias: string;
    districts: IDistrict[];
    createdAt: Date;
    updatedAt: Date;
  }

  interface IDistrict {
    id: number;
    name: string;
    discounts: IDiscount[];
    state: IState;
    stateId: number;
    createdAt: Date;
    updatedAt: Date;
  }

  interface IDiscount {
    id: number;
    label: string;
    description: string;
    value: number;
    districts: IDistrict[];
    createdAt: Date;
    updatedAt: Date;
  }

  interface IPaymentDetail {
    id: number;
    channel: string;
    provider: string;
    bankName: string;
    bankCode: string;
    bankAccountNumber: string;
    ussdCode: string;
    cardType: string;
    cardName: string;
    cardNumber: string;
    cardExpiryDate: Date;
    ccv: string;
    authorizationCode: string;
    customer: ICustomer;
    customerId: number;
    createdAt: Date;
    updatedAt: Date;
  }

  interface IVehicle {
    id: number;
    vin: string;
    model: string;
    make: string;
    engineCylinders: string;
    modelYear: string;
    engineModel: string;
    imageUrl: string;
    roadWorthinessFileUrl: string;
    proofOfOwnershipFileUrl: string;
    registrationNumberFileUrl: string;
    motorReceiptFileUrl: string;
    vehicleInspectionFileUrl: string;
    thirdPartyInsuranceFileUrl: string;
    frontImageUrl: string;
    rearImageUrl: string;
    rightSideImageUrl: string;
    leftSideImageUrl: string;
    engineBayImageUrl: string;
    instrumentClusterImageUrl: string;
    mileageUnit: string;
    mileageValue: string;
    nickname: string;
    plateNumber: string;
    type: string;
    isBooked: boolean;
    isOwner: boolean;
    onInspection: boolean;
    onMaintenance: boolean;
    customer: ICustomer;
    customerId: number;
    appointment: IAppointment;
    appointmentId: number;
    subscription: ICustomerSubscription;
    customerSubscriptionId: number;
    jobs: IJob[];
    tags: ITag;
    createdAt: Date;
    updatedAt: Date;
  }
  IExpenseCategory;
  interface ITag {
    id: number;
    name: string;
    vehicles: IVehicle[];
    createdAt: Date;
    updatedAt: Date;
  }

  interface ITransaction {
    id: number;
    reference: string;
    amount: number;
    status: string;
    authorizationUrl: string;
    serviceStatus: string;
    purpose: string;
    isRequestForInspection: boolean;
    last4: string;
    expMonth: string;
    expYear: string;
    channel: string;
    cardType: string;
    bank: string;
    countryCode: string;
    brand: string;
    currency: string;
    planCode: string;
    paidAt: Date;
    customer: ICustomer;
    customerId: number;
    createdAt: Date;
    updatedAt: Date;
  }

  interface IAppointment {
    id: number;
    code: string;
    status: string;
    appointmentDate: Date;
    serviceLocation: string;
    timeSlot: string;
    planCategory: string;
    modeOfService: string;
    programme: string;
    serviceCost: string;
    inventoryFile: string;
    reportFile: string;
    estimateFile: string;
    vehicle: IVehicle;
    vehicleFault: IVehicleFault;
    customer: ICustomer;
    customerId: number;
    jobs: IJob;
    createdAt: Date;
    updatedAt: Date;
  }

  interface IJob {
    id: number;
    type: string;
    name: string;
    status: string;
    duration: string;
    vehicleOwner: string;
    jobDate: Date;
    vehicle: IVehicle;
    rideShareDriverSubscription: IRideShareDriverSubscription;
    customerSubscription: ICustomerSubscription;
    rideShareDriverSubscriptionId: number;
    customerSubscriptionId: number;
    technician: ITechnician;
    checkList: CheckListType;
    checkLists: ICheckList[];
    technicianId: number;
    mileageUnit: string;
    mileageValue: string;
    frontImageUrl: string;
    rearImageUrl: string;
    rightSideImageUrl: string;
    leftSideImageUrl: string;
    engineBayImageUrl: string;
    instrumentClusterImageUrl: string;
    reportFileUrl: string;
    partner: IPartner;
    partnerId: number;
    createdAt: Date;
    updatedAt: Date;
  }

  interface ICustomerSubscription {
    id: number;
    status: string;
    planType: string;
    planCategory: string;
    modeOfService: string;
    paymentPlan: string;
    maxVehicle: number;
    vehicleCount: number;
    minVehicle: number;
    isHybrid: boolean;
    mobileCount: number;
    maxMobile: number;
    driveInCount: number;
    maxDriveIn: number;
    inspections: number;
    subscriber: string;
    amount: string;
    programme: string;
    planCode: string;
    subscriptionDate: Date;
    nextPaymentDate: Date;
    customers: ICustomer[];
    vehicles: IVehicle[];
    jobs: IJob[];
    transaction: ITransaction;
    createdAt: Date;
    updatedAt: Date;
  }

  interface IDefaultSubscription {
    id: number;
    name: string;
    description: string;
    active: boolean;
    plans: IPlan[];
    createdAt: Date;
    updatedAt: Date;
  }

  interface IPartner {
    id: number;
    name: string;
    slug: string;
    phone: string;
    email: string;
    totalStaff: number;
    totalTechnicians: number;
    brands: string[];
    images: string[];
    yearOfIncorporation: number;
    cac: string;
    vatNumber: string;
    nameOfDirector: string;
    nameOfManager: string;
    logo: string;
    googleMap: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
    workingHours: string[];
    users: IUser[];
    categories: ICategory[];
    technicians: [];
    contact: IContact;
    isAccountProvisioned: boolean;
    createdAt: Date;
    updatedAt: Date;
    accountProvisionStatus: 'NOT_REQUESTED' | 'PENDING' | 'APPROVED' | 'DECLINED';
    upVote?: string;
  }

  interface AccountActivateRequest {
    id?: number;
    businessName: string;

    cacUrl: string;
    validIdFrontUrl: string;
    validIdBackUrl: string;
    isApproved: boolean;
    partner: IPartner;
    partnerId: number;
  }

  interface IPartnerAccount {
    id: string;

    accountRef: string;

    accountNumber: string;

    email: string;

    accountProvider: string;

    isActive: boolean;

    firstName: string;

    lastName: string;

    middleName: string;

    phoneNumber: string;

    businessName: string;

    partner: IPartner;

    partnerId: number;
  }

  interface ICategory {
    id: number;
    name: string;
    description: string;
    plans: IPlan[];
    partners: IPartner[];
    paymentPlans: IPaymentPlan[];
    createdAt: Date;
    updatedAt: Date;
  }

  interface IPlan {
    id: number;
    label: string;
    minVehicles: number;
    maxVehicles: number;
    inspections: number;
    mobile: number;
    driveIn: number;
    validity: string;
    subscriptions: IDefaultSubscription[];
    subscriptionId: number;
    paymentPlans: IPaymentPlan[];
    categories: ICategory[];
    createdAt: Date;
    updatedAt: Date;
  }

  interface IPaymentPlan {
    id: number;
    name: string;
    label: string;
    discount: number;
    value: number;
    hasPromo: boolean;
    descriptions: string[];
    coverage: string;
    parameters: string[];
    pricing: string[];
    plan: IPlan;
    planId: number;
    categories: ICategory[];
    createdAt: Date;
    updatedAt: Date;
  }

  interface IPaymentTerm {
    id: number;
    name: string;
    interest: number;
    split: number;
    discount: number;
    quota: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface Category {
    id: number;
    name: string;
    description: string;
    plans: IPlan[];
    paymentPlans: IPaymentPlan[];
    createdAt: Date;
    updatedAt: Date;
  }

  interface IPermission {
    id: number;
    name: string;
    action: string;
    subject: string;
    inverted: boolean;
    roles: IRole[];
    createdAt: Date;
    updatedAt: Date;
  }

  interface IRole {
    id: number;
    name: string;
    slug: string;
    permissions: IPermission[];
    customers: ICustomer[];
    users: IUser[];
    createdAt: Date;
    updatedAt: Date;
  }

  interface IVehicleFault {
    id: number;
    description: string;
    imagePath: string;
    videoPath: string;
    appointment: IAppointment;
    appointmentId: number;
    createdAt: Date;
    updatedAt: Date;
  }

  interface ICustomer {
    id: number;
    code: string;
    title: string;
    firstName: string;
    lastName: string;
    username: string;
    companyName: string;
    designation: string;
    password: string;
    rawPassword: string;
    email: string;
    phone: string;
    gender: string;
    profileImageUrl: string;
    active: boolean;
    enabled: boolean;
    loginToken: string;
    gatewayId: string;
    frontLicenseImageUrl: string;
    rearLicenseImageUrl: string;
    loginDate: Date;
    contacts: IContact[];
    paymentDetails: IPaymentDetail[];
    vehicles: IVehicle[];
    transactions: ITransaction[];
    appointments: IAppointment[];
    subscriptions: ICustomerSubscription[];
    estimates: IEstimate[];
    billingInformation: IBillingInformation;
    roles: IRole[];
    createdAt: Date;
    updatedAt: Date;
    creditRating?: string;
    partnerId?: number;
    reminders: IServiceReminder[];
  }

  interface ISchedule {
    id: number;
    name: string;
    status: string;
    default: boolean;
    date?: string;
    timeSlots: ITimeSlot[];
    createdAt: Date;
    updatedAt: Date;
  }

  interface ITimeSlot {
    id: number;
    time: string;
    label: string;
    available: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }

  interface IRideShareDriverSubscription {
    id: number;
    status: string;
    planType: string;
    planCategory: string;
    modeOfService: string;
    paymentPlan: string;
    maxVehicle: number;
    vehicleCount: number;
    minVehicle: number;
    isHybrid: boolean;
    mobileCount: number;
    maxMobile: number;
    driveInCount: number;
    maxDriveIn: number;
    inspections: number;
    subscriber: string;
    amount: string;
    programme: string;
    planCode: string;
    subscriptionDate: Date;
    nextPaymentDate: Date;
    rideShareDrivers: IRideShareDriver[];
    transaction: ITransaction;
    jobs: IJob[];
    vehicles: IVehicle[];
    createdAt: Date;
    updatedAt: Date;
  }

  interface IRideShareDriver {
    id: number;
    code: string;
    firstName: string;
    lastName: string;
    username: string;
    companyName: string;
    designation: string;
    password: string;
    rawPassword: string;
    email: string;
    phone: string;
    gender: string;
    profileImageUrl: string;
    active: boolean;
    enabled: boolean;
    loginToken: string;
    gatewayId: string;
    loginDate: Date;
    contacts: IContact[];
    frontLicenseImageUrl: string;
    rearLicenseImageUrl: string;
    paymentDetails: IPaymentDetail[];
    vehicles: IVehicle[];
    transactions: ITransaction[];
    appointments: IAppointment[];
    subscriptions: IRideShareDriverSubscription[];
    estimates: IEstimate[];
    roles: IRole[];
    createdAt: Date;
    updatedAt: Date;
  }

  interface ITechnician {
    id: number;
    code: string;
    firstName: string;
    lastName: string;
    username: string;
    companyName: string;
    designation: string;
    password: string;
    rawPassword: string;
    email: string;
    phone: string;
    gender: string;
    profileImageUrl: string;
    active: boolean;
    enabled: boolean;
    hasJob: boolean;
    loginToken: string;
    gatewayId: string;
    loginDate: Date;
    contacts: IContact[];
    partners: IPartner[];
    jobs: IJob[];
    roles: IRole[];
    createdAt: Date;
    updatedAt: Date;
  }

  interface ICheckList {
    id: number;
    name: string;
    description: string;
    sections: Array<string>;
    approvedByGarageAdmin: boolean;
    isSubmitted: boolean;
    partner: IPartner;
    partnerId: number;
    partners: IPartner[];
    job: IJob;
    jobId: number;
    createdAt: Date;
    updatedAt: Date;
  }

  interface IExpenseCategory {
    name: string;
    id: number;
  }

  interface IExpenseType {
    name: string;
    id: number;
  }

  interface IBeneficiary {
    name: string;
    id?: number;
    accountNumber: string;
    accountName: string;
    bankName: string;
    bankCode?: string;
  }

  interface IExpense {
    id: number;
    date: string;
    amount: number;
    reference: string;
    status: expenseType;
    beneficiary: IBeneficiary;
    category: IExpenseCategory;
    type: IExpenseType;
    invoice: IInvoice;
    invoiceId: number;
    beneficiaryId: number;
    expenseTypeId: number;
    expenseCategoryId: number;
    invoiceCode: string;
    code: any;
    note: string;
    dateModified: any;
    partnerId: number;
  }

  interface IEstimate {
    id: number;
    code: string;
    status: string;
    parts: string[];
    labours: string[];
    partsTotal: number;
    laboursTotal: number;
    grandTotal: number;
    depositAmount: number;
    jobDurationValue: number;
    address: string;
    addressType: string;
    jobDurationUnit: string;
    customer: ICustomer;
    customerId: number;
    rideShareDriver: IRideShareDriver;
    rideShareDriverId: number;
    vehicle: IVehicle;
    vehicleId: number;
    partner: IPartner;
    invoice: IInvoice;
    partnerId: number;
    tax: number;
    taxPart?: number;
    expiresIn: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    discount?: number;
    discountType?: string;
    note?: string;
    count?: number;
    sentStatus?: string;
    internalNote?: string;
  }

  interface IServiceReminder {
    id: number;
    reminderType: string;
    email: string;
    vin: string;
    lastServiceDate: any;
    serviceInterval: number;
    serviceIntervalUnit: string;
    note: string;
    recurring: string;
    status: boolean;
    customer: ICustomer;
    vehicle: IVehicle;
    customerId?: any;
    partnerId?: any;
    nextServiceDate: string;
    reminderStatus: string;
    serviceStatus: string;
    lastServiceMileage: number;
    lastServiceMileageUnit: string;
    nextServiceMileage: number;
    nextServiceMileageUnit: string;
  }

  interface IReminderType {
    id: number;
    name: string;
  }

  interface IPayStackBank {
    id: number;
    name: string;
    slug: string;
    code: string;
    longcode: string;
    gateway: string;
    pay_with_bank: boolean;
    active: boolean;
    country: string;
    currency: string;
    type: string;
    is_deleted: boolean;
    createdAt: string;
    updatedAt: string;
  }

  interface IBillingInformation {
    id: number;
    title: string;
    firstName: string;
    lastName: string;
    phone: string;
    state: string;
    district: string;
    address: string;
    createdAt: string;
    updatedAt: string;
  }

  interface IInvoiceData {
    invoice: string;
    firstName: string;
    lastName: string;
    invoiceDate: Date;
  }

  interface IInvoice {
    id: number;
    code: string;
    status: string;
    purpose: string;
    grandTotal: number;
    depositAmount: number;
    dueAmount: number;
    paidAmount: number;
    additionalDeposit: number;
    refundable: number;
    dueDate: Date;
    parts: string[];
    labours: string[];
    partsTotal: number;
    laboursTotal: number;
    tax: string;
    taxPart: string;
    jobDurationValue: number;
    jobDurationUnit: string;
    address: string;
    addressType: string;
    expiresIn: number;
    url: string;
    edited: boolean;
    updateStatus: string;
    estimate: IEstimate;
    transactions: ITransaction[];
    draftInvoice: IInvoice;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    discount: number;
    discountType: string;
    updateStatus: string;
    internalNote?: string;
  }

  interface AccountDTO {
    email: string;
    phoneNumber: string;
    businessName?: string;
    lastName: string;
    firstName: string;
    trackingReference?: string;
    id?: string;
  }

  interface AccountResponseDTO {
    accountNumber: string;
  }

  interface PaginationDTO {
    pageSize: number;
    pageNumber: number;
  }

  interface AccountBalanceDTO {
    ledgerBalance: number;
    availableBalance: number;
    withdrawableBalance: number;
    accountNumber?: string;
    accountName?: string;
    accountProvider?: string;
    businessName?: string;
  }

  interface AccountTransactionLogDTO {
    accountId: string;
    page: PaginationDTO;
  }

  interface PostingEntry {
    referenceNumber: string;
    reversalReferenceNumber: string;
    accountNumber: string;
    linkedAccountNumber: string;
    realDate: string;
    amount: number;
    openingBalance: number;
    balanceAfter: number;
    narration: string;
    instrumentNumber: string;
    postingRecordType: string;
    postedBy: string;
  }

  interface AccountTransactionsResponseDTO {
    postingsHistory: PostingEntry[];
    totalRecordInStore: number;
    totalDebit: number;
    totalCredit: number;
    statusCode: string;
    message: string;
  }

  interface ConfirmRecipientDTO {
    beneficiaryAccountNumber: string;
    beneficiaryBankCode: string;
    senderTrackingReference: string;
    isRequestFromVirtualAccount: string;
  }

  interface AccountHolder {
    beneficiaryAccountNumber: string;
    beneficiaryName: string;
    senderAccountNumber: string;
    senderName: string;
    beneficiaryCustomerID: number;
    beneficiaryBankCode: string;
    nameEnquiryID: string;
    responseCode: string;
    transferCharge: number;
    sessionID: string;
  }

  interface IBulkTransfer {
    accountNumber: string;
    bank: {
      label: string;
      value: string;
    };
    accountName: string;
    amount: string;
    narration: string;
    saveAsBeneficiary?: boolean;
    pin?: string;
  } 
  
  interface UploadResult {
    file: {
      url: string;
      name: string;
    };
    uploadStartTime: Date | null;
    busboyFinishTime: Date | null;
    s3UploadFinishTime: Date | null;
  }

  interface IBank {
    bankName: string;
    bankCode: string;
  }

  export interface AccountTransferDTO {
    trackingReference?: string;
    beneficiaryAccount: string;
    amount: number;
    narration: string;
    beneficiaryBankCode: string;
    beneficiaryName: string;
    senderName?: string;
    NameEnquirySessionID: string;
    clientFeeCharge?: number;
    saveAsBeneficiary?: boolean;
    bankName?: string;
    pin: string;
    expenseId?: number;
  }

  export interface AccountTransferResponseDTO {
    requestReference: string;
    transactionReference: string;
    responseCode: string;
    status: boolean;
    message: string;
    data: any;
  }

  export interface VirtualAccountsDTO {
    accounts: Accounts[];
    totalCounts: number
  }

  export interface Accounts {
    accountNumber: string;
    email: string;
    phoneNumber: string;
    lastName: string;
    firstName: string;
    middleName: string;
    businessName: string;
    accountName: string;
    trackingReference: string;
    creationDate: Date;
    isDeleted: boolean;
  }

  interface IBeneficiary {
    name: string;
    id?: number;
    accountNumber: string;
    accountName: string;
    bankName: string;
    bankCode?: string;
  }

  export interface BulkNameEnquiryResponseDTO  {
    narration: string;
    totalAmount: number;
    expectedFee: number;
    paidFee: number;
    accountNumber: string;
    accountName: string;
    transactionStatus: string;
    beneficiaries: BulkNameEnquiryBeneficiary[]
  }

  interface BulkNameEnquiry {
    AccountNumber: string;
    BankCode: string;
  }
  
  export interface BulkNameEnquiryDTO {
    Data: BulkNameEnquiry[]
  }

  export interface BulkAccountTransferDTO {
    ClientAccountNumber?: string;
    TrackingReference?: string;
    TotalAmount?: string;
    NotificationEmail?: string;
    narration: string;
    BeneficiaryPaymentData: BeneficiaryPaymentData[];
    pin: string;
  }

  export interface BulkAccountResponseDTO {
    requestReference: string,
    transactionReference: string,
    instrumentNumber: string,
    responseCode: string,
    status: boolean,
    message: string,
    data: any
  }
}
