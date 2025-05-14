import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING, SHADOWS } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail, LogOut, Settings, Bell, Shield, CircleHelp as HelpCircle, Truck, ShoppingCart } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to log out?')) {
        logout();
      }
    } else {
      Alert.alert(
        'Confirm Logout',
        'Are you sure you want to log out?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Logout', style: 'destructive', onPress: () => logout() }
        ]
      );
    }
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'admin':
        return <Shield size={24} color={COLORS.primary} />;
      case 'worker':
        return <Settings size={24} color={COLORS.success} />;
      case 'customer':
        return <ShoppingCart size={24} color={COLORS.secondary} />;
      case 'deliverer':
        return <Truck size={24} color="#B91C1C" />;
      default:
        return <User size={24} color={COLORS.primary} />;
    }
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'admin':
        return COLORS.primary;
      case 'worker':
        return COLORS.success;
      case 'customer':
        return COLORS.secondary;
      case 'deliverer':
        return "#B91C1C";
      default:
        return COLORS.primary;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{user?.name.charAt(0)}</Text>
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        
        <View style={[styles.roleBadge, { backgroundColor: getRoleColor() + '20' }]}>
          {getRoleIcon()}
          <Text style={[styles.roleText, { color: getRoleColor() }]}>
            {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
          </Text>
        </View>
        
        <View style={styles.emailContainer}>
          <Mail size={16} color={COLORS.textSecondary} />
          <Text style={styles.emailText}>{user?.email}</Text>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <User size={20} color={COLORS.primary} />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuItemText}>Edit Profile</Text>
            <Text style={styles.menuItemDescription}>Update your personal information</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Bell size={20} color={COLORS.secondary} />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuItemText}>Notifications</Text>
            <Text style={styles.menuItemDescription}>Manage your notification preferences</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Shield size={20} color={COLORS.success} />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuItemText}>Privacy & Security</Text>
            <Text style={styles.menuItemDescription}>Control your privacy settings</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <HelpCircle size={20} color="#6D28D9" />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuItemText}>Help Center</Text>
            <Text style={styles.menuItemDescription}>Get help with the app</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <Mail size={20} color="#0EA5E9" />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuItemText}>Contact Support</Text>
            <Text style={styles.menuItemDescription}>Reach out to our support team</Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <LogOut size={20} color={COLORS.error} />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.appVersion}>LogiTrack v1.0.0</Text>
        <Text style={styles.copyright}>© 2025 LogiTrack Logistics Management</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  avatarText: {
    fontFamily: FONTS.heading,
    fontSize: 40,
    color: COLORS.primary,
  },
  userName: {
    fontFamily: FONTS.heading,
    fontSize: FONT_SIZES.xl,
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    marginBottom: SPACING.m,
  },
  roleText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZES.s,
    marginLeft: SPACING.xs,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailText: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.m,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  sectionContainer: {
    backgroundColor: COLORS.surface,
    marginTop: SPACING.l,
    padding: SPACING.l,
    ...SHADOWS.small,
  },
  sectionTitle: {
    fontFamily: FONTS.heading,
    fontSize: FONT_SIZES.l,
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuItemText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZES.m,
    color: COLORS.text,
    marginBottom: 2,
  },
  menuItemDescription: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.s,
    color: COLORS.textSecondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    marginTop: SPACING.l,
    padding: SPACING.l,
    ...SHADOWS.small,
  },
  logoutButtonText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: FONT_SIZES.m,
    color: COLORS.error,
    marginLeft: SPACING.s,
  },
  footer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  appVersion: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.s,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  copyright: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
});