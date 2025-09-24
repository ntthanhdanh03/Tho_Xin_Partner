export const REQUIRED_DOCUMENTS = [
    { id: 'identity_chip', label: 'CCCD gắn chip', navigationTo: 'IdentityChipView' },
    {
        id: 'owner_verification',
        label: 'Thông tin SIM chính chủ',
        navigationTo: 'OwnerVerificationView',
    },
    { id: 'judicial_record', label: 'Lý lịch tư pháp', navigationTo: 'JudicialRecordView' },
    { id: 'avt_view', label: 'Ảnh đại diện', navigationTo: 'UploadAvatarView' },
    { id: 'chose_field_view', label: 'Lĩnh vực của bạn', navigationTo: 'ChoseFieldView' },
]

export const GENDER = [
    { key: 'male', name: 'Nam' },
    { key: 'female', name: 'Nữ' },
]

export const FIELD = [
    { key: 'electricity', name: 'Điện' },
    { key: 'water', name: 'Nước' },
    { key: 'locksmith', name: 'Khóa' },
    { key: 'air_conditioning', name: 'Điện lạnh' },
]
