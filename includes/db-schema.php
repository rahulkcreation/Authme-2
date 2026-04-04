<?php
/**
 * AuthMe — Database Schema Registry
 *
 * This file is the SINGLE source of truth for all database
 * tables and their column definitions used by the AuthMe plugin.
 * Every other file that interacts with the database should
 * reference this schema for table names and column structures.
 *
 * @package AuthMe
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class AuthMe_DB_Schema {

    /* ================================================
     * 📋 TABLE NAMES
     * ================================================ */

    /**
     * Get the full table name for the OTP storage table.
     *
     * @return string Full table name with WordPress prefix.
     */
    public static function otp_table() {
        global $wpdb;
        return $wpdb->prefix . 'authme_otp_storage';
    }

    /**
     * Get the full table name for the host request table.
     *
     * @return string Full table name with WordPress prefix.
     */
    public static function host_request_table() {
        global $wpdb;
        return $wpdb->prefix . 'host_request';
    }

    /* ================================================
     * 📐 TABLE SCHEMAS
     * ================================================
     * Each schema method returns an array describing
     * every column in the table.
     *
     * Schema Format:
     *   'column_name' => array(
     *       'type'     => MySQL column type (e.g. INT(11), VARCHAR(100))
     *       'null'     => true/false — whether NULL is allowed
     *       'default'  => default value or null for no default
     *       'extra'    => AUTO_INCREMENT, CURRENT_TIMESTAMP, etc.
     *       'key'      => PRIMARY, INDEX, or null
     *       'comment'  => Human-readable description
     *   )
     * ================================================ */

    /**
     * Schema for the OTP storage table (wp_authme_otp_storage).
     *
     * Stores OTP codes for registration, login verification,
     * and password reset flows. Each row represents a single
     * OTP request with its verification status.
     *
     * @return array Associative array of column definitions.
     */
    public static function otp_table_schema() {
        return array(
            'id' => array(
                'type'    => 'INT(11)',
                'null'    => false,
                'default' => null,
                'extra'   => 'AUTO_INCREMENT',
                'key'     => 'PRIMARY',
                'comment' => 'Unique auto-increment row identifier.',
            ),
            'email' => array(
                'type'    => 'VARCHAR(100)',
                'null'    => false,
                'default' => null,
                'extra'   => null,
                'key'     => 'INDEX (composite: email_purpose)',
                'comment' => 'Email address the OTP was sent to.',
            ),
            'otp_code' => array(
                'type'    => 'VARCHAR(6)',
                'null'    => false,
                'default' => null,
                'extra'   => null,
                'key'     => null,
                'comment' => '6-digit OTP code generated for the request.',
            ),
            'purpose' => array(
                'type'    => 'VARCHAR(20)',
                'null'    => false,
                'default' => 'registration',
                'extra'   => null,
                'key'     => 'INDEX (composite: email_purpose)',
                'comment' => 'Purpose of the OTP: registration, login, or password_reset.',
            ),
            'created_at' => array(
                'type'    => 'TIMESTAMP',
                'null'    => false,
                'default' => 'CURRENT_TIMESTAMP',
                'extra'   => null,
                'key'     => null,
                'comment' => 'Timestamp when the OTP was generated.',
            ),
            'expires_at' => array(
                'type'    => 'TIMESTAMP',
                'null'    => false,
                'default' => 'CURRENT_TIMESTAMP',
                'extra'   => null,
                'key'     => null,
                'comment' => 'Timestamp when the OTP expires (usually created_at + 10 min).',
            ),
            'is_verified' => array(
                'type'    => 'TINYINT(1)',
                'null'    => false,
                'default' => 0,
                'extra'   => null,
                'key'     => null,
                'comment' => 'Whether the OTP has been verified: 0 = not verified, 1 = verified.',
            ),
            'user_data' => array(
                'type'    => 'TEXT',
                'null'    => true,
                'default' => null,
                'extra'   => null,
                'key'     => null,
                'comment' => 'JSON blob storing user registration data (username, email, password hash, etc.) until OTP is verified.',
            ),
        );
    }

    /**
     * Schema for the host request table (wp_host_request).
     *
     * Stores "Become a Host" application submissions.
     * Each row represents a single host application with
     * the applicant's data and its current approval status.
     *
     * @return array Associative array of column definitions.
     */
    public static function host_request_table_schema() {
        return array(
            'id' => array(
                'type'    => 'INT(11)',
                'null'    => false,
                'default' => null,
                'extra'   => 'AUTO_INCREMENT',
                'key'     => 'PRIMARY',
                'comment' => 'Unique auto-increment row identifier.',
            ),
            'user_data' => array(
                'type'    => 'LONGTEXT',
                'null'    => true,
                'default' => null,
                'extra'   => null,
                'key'     => null,
                'comment' => 'JSON blob containing the host application data: fullname, username, email, mobile, country code, etc.',
            ),
            'status' => array(
                'type'    => 'VARCHAR(50)',
                'null'    => false,
                'default' => 'pending',
                'extra'   => null,
                'key'     => null,
                'comment' => 'Application status: pending, approved, or rejected.',
            ),
            'date' => array(
                'type'    => 'DATETIME',
                'null'    => true,
                'default' => 'CURRENT_TIMESTAMP',
                'extra'   => null,
                'key'     => null,
                'comment' => 'Date & time when the host application was submitted.',
            ),
        );
    }

    /* ================================================
     * 🔍 HELPER: Get Required Column Names
     * ================================================ */

    /**
     * Get an array of required column names for the OTP table.
     *
     * @return array List of column names.
     */
    public static function otp_required_columns() {
        return array_keys( self::otp_table_schema() );
    }

    /**
     * Get an array of required column names for the host request table.
     *
     * @return array List of column names.
     */
    public static function host_required_columns() {
        return array_keys( self::host_request_table_schema() );
    }

    /* ================================================
     * 🛠️ HELPER: Generate CREATE TABLE SQL
     * ================================================ */

    /**
     * Generate the CREATE TABLE SQL for the OTP storage table.
     *
     * @return string SQL statement for dbDelta.
     */
    public static function otp_create_sql() {
        global $wpdb;
        $table   = self::otp_table();
        $charset = $wpdb->get_charset_collate();

        return "CREATE TABLE {$table} (
            id INT(11) NOT NULL AUTO_INCREMENT,
            email VARCHAR(100) NOT NULL,
            otp_code VARCHAR(6) NOT NULL,
            purpose VARCHAR(20) NOT NULL DEFAULT 'registration',
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            is_verified TINYINT(1) NOT NULL DEFAULT 0,
            user_data TEXT,
            PRIMARY KEY (id),
            KEY email_purpose (email, purpose)
        ) {$charset};";
    }

    /**
     * Generate the CREATE TABLE SQL for the host request table.
     *
     * @return string SQL statement for dbDelta.
     */
    public static function host_request_create_sql() {
        global $wpdb;
        $table   = self::host_request_table();
        $charset = $wpdb->get_charset_collate();

        return "CREATE TABLE {$table} (
            id INT(11) NOT NULL AUTO_INCREMENT,
            user_data LONGTEXT,
            status VARCHAR(50) NOT NULL DEFAULT 'pending',
            date DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) {$charset};";
    }
}
