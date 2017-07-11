export const ruleFormat = (role) => {
    if (role == 0) {
        return ''
    } else if (role == 1) {
        return '先生'
    } else if (role == 2) {
        return '女士'
    }
}