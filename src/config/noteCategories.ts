// 获取显示名称的辅助函数 - 只将连字符替换为空格
export function getCategoryDisplayName(folderName: string): string {
  return folderName
  .split('-')  // 只在不在括号内的连字符处分割
  .map(word => {
    // 如果单词以方括号开头，保持原样
    if (word.startsWith('[') || word.includes(']')) {
      return word;
    }
    // 否则将首字母大写
    return word.charAt(0).toUpperCase() + word.slice(1);
  })
  .join(' ');
} 