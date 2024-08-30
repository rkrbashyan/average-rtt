export var MessageKind;
(function (MessageKind) {
    MessageKind[MessageKind["Ping"] = 0] = "Ping";
    MessageKind[MessageKind["Pong"] = 1] = "Pong";
})(MessageKind || (MessageKind = {}));
const UINT8_SIZE = 1;
const FLOAT32_SIZE = 4;
const allocUint8Field = (allocator) => {
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
const allocFloat32Field = (allocator) => {
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
const validator = (kindFiled, kind, size) => {
    return (view) => {
        return view.byteLength === size && kindFiled.read(view) === kind;
    };
};
export const PingMessage = (() => {
    const allocator = { size: 0 };
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
    const allocator = { size: 0 };
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
