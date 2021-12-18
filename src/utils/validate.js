/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

// export function validateForm() {
//   return {
//     type: [
//       { required: true, message: '必填项', trigger: 'blur' },
//     ],
//     title: [
//       { required: true, message: '必填项，长度255字以内', trigger: 'blur' },
//     ],
//     banner: [
//       { required: true, message: '必填项', trigger: 'blur' },
//     ]
//   }
// }
