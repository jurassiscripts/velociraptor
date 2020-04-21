const regex = /'(?:\\'|.)*?'|"(?:\\"|.)*?"|(?:\\\ |\S)+/g;

export const parseCommand = (command: string): string[] => command.match(regex) as string[];