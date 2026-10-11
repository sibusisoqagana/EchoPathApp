import React from 'react';
import {Modal, View, Text, Pressable, StyleSheet} from 'react-native';
import {C, radius} from '../theme/colours';

export default function AppModal({visible, title, message, confirmLabel = 'CONFIRM', cancelLabel = 'CANCEL', onConfirm, onCancel, danger}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <View style={styles.row}>
            <Pressable style={[styles.btn, styles.cancel]} onPress={onCancel}>
              <Text style={styles.cancelText}>{cancelLabel}</Text>
            </Pressable>
            <Pressable style={[styles.btn, danger ? styles.danger : styles.confirm]} onPress={onConfirm}>
              <Text style={styles.confirmText}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {flex: 1, backgroundColor: 'rgba(5,2,20,0.85)', justifyContent: 'center', alignItems: 'center', padding: 30},
  card: {width: '100%', backgroundColor: C.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: C.border, padding: 24},
  title: {color: C.white, fontSize: 20, fontWeight: '900', marginBottom: 10},
  message: {color: C.muted, fontSize: 14, lineHeight: 20, marginBottom: 22},
  row: {flexDirection: 'row', gap: 10},
  btn: {flex: 1, paddingVertical: 14, borderRadius: radius.md, alignItems: 'center'},
  cancel: {backgroundColor: 'transparent', borderWidth: 1.5, borderColor: C.border},
  confirm: {backgroundColor: C.cyan},
  danger: {backgroundColor: C.rose},
  cancelText: {color: C.muted, fontWeight: '900', letterSpacing: 1},
  confirmText: {color: '#000', fontWeight: '900', letterSpacing: 1},
});
