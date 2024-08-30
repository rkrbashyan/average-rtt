export enum MessageKind {
  Ping,
  Pong,
}

interface Field {
  offset: number;
  size: number;
  read: (view: DataView) => number;
  write: (view: DataView, value: number) => void;
}

const UINT8_SIZE = 1;
const FLOAT32_SIZE = 4;

interface Allocator {
  size: number;
}

const allocUint8Field = (allocator: Allocator): Field => {
  const offset = allocator.size;
  const size = UINT8_SIZE;
  allocator.size += size;
  return {
    offset,
    size,
    read: (view) => view.getUint8(offset),
    write: (view, value) => view.setUint8(offset, value),
  };
};

const allocFloat32Field = (allocator: Allocator): Field => {
  const offset = allocator.size;
  const size = FLOAT32_SIZE;
  allocator.size += size;
  return {
    offset,
    size,
    read: (view) => view.getFloat32(offset),
    write: (view, value) => view.setFloat32(offset, value),
  };
};

const validator = (kindFiled: Field, kind: MessageKind, size: number): ((view: DataView) => boolean) => {
  return (view: DataView) => {
    return view.byteLength === size && kindFiled.read(view) === kind;
  };
};

export const PingMessage = (() => {
  const allocator: Allocator = { size: 0 };
  const kind = allocUint8Field(allocator);
  const timestamp = allocFloat32Field(allocator);
  const size = allocator.size;
  const validate = validator(kind, MessageKind.Ping, size);
  return {
    kind,
    timestamp,
    size,
    validate,
  };
})();

export const PongMessage = (() => {
  const allocator: Allocator = { size: 0 };
  const kind = allocUint8Field(allocator);
  const timestamp = allocFloat32Field(allocator);
  const size = allocator.size;
  const validate = validator(kind, MessageKind.Pong, size);
  return {
    kind,
    timestamp,
    size,
    validate,
  };
})();
