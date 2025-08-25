export const REQUIRED_DOCUMENTS = [
    { id: 'identity_chip', label: 'CCCD gắn chip', navigationTo: 'IdentityChipView' },
    {
        id: 'owner_verification',
        label: 'Thông tin sim chính chủ',
        navigationTo: 'OwnerVerificationView',
    },
    { id: 'judicial_record', label: 'Lý lịch tư pháp', navigationTo: 'JudicialRecordView' },
]

export const GENDER = [
    { key: 'male', name: 'Nam' },
    { key: 'female', name: 'Nữ' },
]
