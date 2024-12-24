export interface PostgresErrorClass {
  prefix: string;
  name: string;
  sensitive: boolean;
}
export interface PostgresErrorCode {
  name: string;
  code: string;
  class: PostgresErrorClass;
}

export const SuccessfulCompletionErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "00",
  name: "Successful Completion",
};
export const WarningErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "01",
  name: "Warning",
};
export const NoDataErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "02",
  name: "No Data (this is also a warning class per the SQL standard)",
};
export const SQLStatementNotYetCompleteErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "03",
  name: "SQL Statement Not Yet Complete",
};
export const ConnectionExceptionErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "08",
  name: "Connection Exception",
};
export const TriggeredActionExceptionErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "09",
  name: "Triggered Action Exception",
};
export const FeatureNotSupportedErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "0A",
  name: "Feature Not Supported",
};
export const InvalidTransactionInitiationErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "0B",
  name: "Invalid Transaction Initiation",
};
export const LocatorExceptionErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "0F",
  name: "Locator Exception",
};
export const InvalidGrantorErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "0L",
  name: "Invalid Grantor",
};
export const InvalidRoleSpecificationErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "0P",
  name: "Invalid Role Specification",
};
export const DiagnosticsExceptionErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "0Z",
  name: "Diagnostics Exception",
};

export const CaseNotFoundErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "20",
  name: "Case Not Found",
};
export const CardinalityViolationErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "21",
  name: "Cardinality Violation",
};
export const DataExceptionErrorClass: PostgresErrorClass = {
  sensitive: false,
  prefix: "22",
  name: "Data Exception",
};
export const IntegrityConstraintViolationErrorClass: PostgresErrorClass = {
  sensitive: false,
  prefix: "23",
  name: "Integrity Constraint Violation",
};
export const InvalidCursorStateErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "24",
  name: "Invalid Cursor State",
};
export const InvalidTransactionStateErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "25",
  name: "Invalid Transaction State",
};
export const InvalidSQLStatementNameErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "26",
  name: "Invalid SQL Statement Name",
};
export const TriggeredDataChangeViolationErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "27",
  name: "Triggered Data Change Violation",
};
export const InvalidAuthorizationSpecificationErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "28",
  name: "Invalid Authorization Specification",
};
export const InvalidCursorNameErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "34",
  name: "Invalid Cursor Name",
};
export const ExternalRoutineExceptionErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "38",
  name: "External Routine Exception",
};
export const ExternalRoutineInvocationExceptionErrorClass: PostgresErrorClass =
  {
    sensitive: true,
    prefix: "39",
    name: "External Routine Invocation Exception",
  };
export const TransactionRollbackErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "40",
  name: "Transaction Rollback",
};
export const SyntaxErrorOrAccessRuleViolationErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "42",
  name: "Syntax Error or Access Rule Violation",
};
export const WITHCHECKOPTIONViolationErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "44",
  name: "WITH CHECK OPTION Violation",
};
export const InsufficientResourcesErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "53",
  name: "Insufficient Resources",
};
export const ProgramLimitExceededErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "54",
  name: "Program Limit Exceeded",
};
export const ObjectNotInPrerequisiteStateErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "55",
  name: "Object Not In Prerequisite State",
};
export const OperatorInterventionErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "57",
  name: "Operator Intervention",
};
export const SystemErrorErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "58",
  name: "System Error (errors external to PostgreSQL itself)",
};
export const DependentPrivilegeDescriptorsStillExistErrorClass: PostgresErrorClass =
  {
    sensitive: true,
    prefix: "2B",
    name: "Dependent Privilege Descriptors Still Exist",
  };
export const InvalidTransactionTerminationErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "2D",
  name: "Invalid Transaction Termination",
};
export const SQLRoutineExceptionErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "2F",
  name: "SQL Routine Exception",
};
export const SavepointExceptionErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "3B",
  name: "Savepoint Exception",
};
export const InvalidCatalogNameErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "3D",
  name: "Invalid Catalog Name",
};
export const InvalidSchemaNameErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "3F",
  name: "Invalid Schema Name",
};
export const ConfigurationFileErrorErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "F0",
  name: "Configuration File Error",
};
export const ForeignDataWrapperErrorSQLMEDErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "HV",
  name: "Foreign Data Wrapper Error (SQL/MED)",
};
export const PLpgSQLErrorErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "P0",
  name: "PL/pgSQL Error",
};
export const InternalErrorErrorClass: PostgresErrorClass = {
  sensitive: true,
  prefix: "XX",
  name: "Internal Error",
};

export const postgresErrorCodes = {
  "00000": {
    name: "successful_completion",
    code: "00000",
    class: SuccessfulCompletionErrorClass,
  },
  "01000": {
    name: "warning",
    code: "01000",
    class: WarningErrorClass,
  },
  "0100C": {
    name: "dynamic_result_sets_returned",
    code: "0100C",
    class: WarningErrorClass,
  },
  "01008": {
    name: "implicit_zero_bit_padding",
    code: "01008",
    class: WarningErrorClass,
  },
  "01003": {
    name: "null_value_eliminated_in_set_function",
    code: "01003",
    class: WarningErrorClass,
  },
  "01007": {
    name: "privilege_not_granted",
    code: "01007",
    class: WarningErrorClass,
  },
  "01006": {
    name: "privilege_not_revoked",
    code: "01006",
    class: WarningErrorClass,
  },
  "01004": {
    name: "string_data_right_truncation",
    code: "01004",
    class: WarningErrorClass,
  },
  "01P01": {
    name: "deprecated_feature",
    code: "01P01",
    class: WarningErrorClass,
  },
  "02000": {
    name: "no_data",
    code: "02000",
    class: NoDataErrorClass,
  },
  "02001": {
    name: "no_additional_dynamic_result_sets_returned",
    code: "02001",
    class: NoDataErrorClass,
  },
  "03000": {
    name: "sql_statement_not_yet_complete",
    code: "03000",
    class: SQLStatementNotYetCompleteErrorClass,
  },
  "08000": {
    name: "connection_exception",
    code: "08000",
    class: ConnectionExceptionErrorClass,
  },
  "08003": {
    name: "connection_does_not_exist",
    code: "08003",
    class: ConnectionExceptionErrorClass,
  },
  "08006": {
    name: "connection_failure",
    code: "08006",
    class: ConnectionExceptionErrorClass,
  },
  "08001": {
    name: "sqlclient_unable_to_establish_sqlconnection",
    code: "08001",
    class: ConnectionExceptionErrorClass,
  },
  "08004": {
    name: "sqlserver_rejected_establishment_of_sqlconnection",
    code: "08004",
    class: ConnectionExceptionErrorClass,
  },
  "08007": {
    name: "transaction_resolution_unknown",
    code: "08007",
    class: ConnectionExceptionErrorClass,
  },
  "08P01": {
    name: "protocol_violation",
    code: "08P01",
    class: ConnectionExceptionErrorClass,
  },
  "09000": {
    name: "triggered_action_exception",
    code: "09000",
    class: TriggeredActionExceptionErrorClass,
  },
  "0A000": {
    name: "feature_not_supported",
    code: "0A000",
    class: FeatureNotSupportedErrorClass,
  },
  "0B000": {
    name: "invalid_transaction_initiation",
    code: "0B000",
    class: InvalidTransactionInitiationErrorClass,
  },
  "0F000": {
    name: "locator_exception",
    code: "0F000",
    class: LocatorExceptionErrorClass,
  },
  "0F001": {
    name: "invalid_locator_specification",
    code: "0F001",
    class: LocatorExceptionErrorClass,
  },
  "0L000": {
    name: "invalid_grantor",
    code: "0L000",
    class: InvalidGrantorErrorClass,
  },
  "0LP01": {
    name: "invalid_grant_operation",
    code: "0LP01",
    class: InvalidGrantorErrorClass,
  },
  "0P000": {
    name: "invalid_role_specification",
    code: "0P000",
    class: InvalidRoleSpecificationErrorClass,
  },
  "0Z000": {
    name: "diagnostics_exception",
    code: "0Z000",
    class: DiagnosticsExceptionErrorClass,
  },
  "0Z002": {
    name: "stacked_diagnostics_accessed_without_active_handler",
    code: "0Z002",
    class: DiagnosticsExceptionErrorClass,
  },
  "20000": {
    name: "case_not_found",
    code: "20000",
    class: CaseNotFoundErrorClass,
  },
  "21000": {
    name: "cardinality_violation",
    code: "21000",
    class: CardinalityViolationErrorClass,
  },
  "22000": {
    name: "data_exception",
    code: "22000",
    class: DataExceptionErrorClass,
  },
  "2202E": {
    name: "array_subscript_error",
    code: "2202E",
    class: DataExceptionErrorClass,
  },
  "22021": {
    name: "character_not_in_repertoire",
    code: "22021",
    class: DataExceptionErrorClass,
  },
  "22008": {
    name: "datetime_field_overflow",
    code: "22008",
    class: DataExceptionErrorClass,
  },
  "22012": {
    name: "division_by_zero",
    code: "22012",
    class: DataExceptionErrorClass,
  },
  "22005": {
    name: "error_in_assignment",
    code: "22005",
    class: DataExceptionErrorClass,
  },
  "2200B": {
    name: "escape_character_conflict",
    code: "2200B",
    class: DataExceptionErrorClass,
  },
  "22022": {
    name: "indicator_overflow",
    code: "22022",
    class: DataExceptionErrorClass,
  },
  "22015": {
    name: "interval_field_overflow",
    code: "22015",
    class: DataExceptionErrorClass,
  },
  "2201E": {
    name: "invalid_argument_for_logarithm",
    code: "2201E",
    class: DataExceptionErrorClass,
  },
  "22014": {
    name: "invalid_argument_for_ntile_function",
    code: "22014",
    class: DataExceptionErrorClass,
  },
  "22016": {
    name: "invalid_argument_for_nth_value_function",
    code: "22016",
    class: DataExceptionErrorClass,
  },
  "2201F": {
    name: "invalid_argument_for_power_function",
    code: "2201F",
    class: DataExceptionErrorClass,
  },
  "2201G": {
    name: "invalid_argument_for_width_bucket_function",
    code: "2201G",
    class: DataExceptionErrorClass,
  },
  "22018": {
    name: "invalid_character_value_for_cast",
    code: "22018",
    class: DataExceptionErrorClass,
  },
  "22007": {
    name: "invalid_datetime_format",
    code: "22007",
    class: DataExceptionErrorClass,
  },
  "22019": {
    name: "invalid_escape_character",
    code: "22019",
    class: DataExceptionErrorClass,
  },
  "2200D": {
    name: "invalid_escape_octet",
    code: "2200D",
    class: DataExceptionErrorClass,
  },
  "22025": {
    name: "invalid_escape_sequence",
    code: "22025",
    class: DataExceptionErrorClass,
  },
  "22P06": {
    name: "nonstandard_use_of_escape_character",
    code: "22P06",
    class: DataExceptionErrorClass,
  },
  "22010": {
    name: "invalid_indicator_parameter_value",
    code: "22010",
    class: DataExceptionErrorClass,
  },
  "22023": {
    name: "invalid_parameter_value",
    code: "22023",
    class: DataExceptionErrorClass,
  },
  "22013": {
    name: "invalid_preceding_or_following_size",
    code: "22013",
    class: DataExceptionErrorClass,
  },
  "2201B": {
    name: "invalid_regular_expression",
    code: "2201B",
    class: DataExceptionErrorClass,
  },
  "2201W": {
    name: "invalid_row_count_in_limit_clause",
    code: "2201W",
    class: DataExceptionErrorClass,
  },
  "2201X": {
    name: "invalid_row_count_in_result_offset_clause",
    code: "2201X",
    class: DataExceptionErrorClass,
  },
  "2202H": {
    name: "invalid_tablesample_argument",
    code: "2202H",
    class: DataExceptionErrorClass,
  },
  "2202G": {
    name: "invalid_tablesample_repeat",
    code: "2202G",
    class: DataExceptionErrorClass,
  },
  "22009": {
    name: "invalid_time_zone_displacement_value",
    code: "22009",
    class: DataExceptionErrorClass,
  },
  "2200C": {
    name: "invalid_use_of_escape_character",
    code: "2200C",
    class: DataExceptionErrorClass,
  },
  "2200G": {
    name: "most_specific_type_mismatch",
    code: "2200G",
    class: DataExceptionErrorClass,
  },
  "22004": {
    name: "null_value_not_allowed",
    code: "22004",
    class: DataExceptionErrorClass,
  },
  "22002": {
    name: "null_value_no_indicator_parameter",
    code: "22002",
    class: DataExceptionErrorClass,
  },
  "22003": {
    name: "numeric_value_out_of_range",
    code: "22003",
    class: DataExceptionErrorClass,
  },
  "2200H": {
    name: "sequence_generator_limit_exceeded",
    code: "2200H",
    class: DataExceptionErrorClass,
  },
  "22026": {
    name: "string_data_length_mismatch",
    code: "22026",
    class: DataExceptionErrorClass,
  },
  "22001": {
    name: "string_data_right_truncation",
    code: "22001",
    class: DataExceptionErrorClass,
  },
  "22011": {
    name: "substring_error",
    code: "22011",
    class: DataExceptionErrorClass,
  },
  "22027": {
    name: "trim_error",
    code: "22027",
    class: DataExceptionErrorClass,
  },
  "22024": {
    name: "unterminated_c_string",
    code: "22024",
    class: DataExceptionErrorClass,
  },
  "2200F": {
    name: "zero_length_character_string",
    code: "2200F",
    class: DataExceptionErrorClass,
  },
  "22P01": {
    name: "floating_point_exception",
    code: "22P01",
    class: DataExceptionErrorClass,
  },
  "22P02": {
    name: "invalid_text_representation",
    code: "22P02",
    class: DataExceptionErrorClass,
  },
  "22P03": {
    name: "invalid_binary_representation",
    code: "22P03",
    class: DataExceptionErrorClass,
  },
  "22P04": {
    name: "bad_copy_file_format",
    code: "22P04",
    class: DataExceptionErrorClass,
  },
  "22P05": {
    name: "untranslatable_character",
    code: "22P05",
    class: DataExceptionErrorClass,
  },
  "2200L": {
    name: "not_an_xml_document",
    code: "2200L",
    class: DataExceptionErrorClass,
  },
  "2200M": {
    name: "invalid_xml_document",
    code: "2200M",
    class: DataExceptionErrorClass,
  },
  "2200N": {
    name: "invalid_xml_content",
    code: "2200N",
    class: DataExceptionErrorClass,
  },
  "2200S": {
    name: "invalid_xml_comment",
    code: "2200S",
    class: DataExceptionErrorClass,
  },
  "2200T": {
    name: "invalid_xml_processing_instruction",
    code: "2200T",
    class: DataExceptionErrorClass,
  },
  "22030": {
    name: "duplicate_json_object_key_value",
    code: "22030",
    class: DataExceptionErrorClass,
  },
  "22031": {
    name: "invalid_argument_for_sql_json_datetime_function",
    code: "22031",
    class: DataExceptionErrorClass,
  },
  "22032": {
    name: "invalid_json_text",
    code: "22032",
    class: DataExceptionErrorClass,
  },
  "22033": {
    name: "invalid_sql_json_subscript",
    code: "22033",
    class: DataExceptionErrorClass,
  },
  "22034": {
    name: "more_than_one_sql_json_item",
    code: "22034",
    class: DataExceptionErrorClass,
  },
  "22035": {
    name: "no_sql_json_item",
    code: "22035",
    class: DataExceptionErrorClass,
  },
  "22036": {
    name: "non_numeric_sql_json_item",
    code: "22036",
    class: DataExceptionErrorClass,
  },
  "22037": {
    name: "non_unique_keys_in_a_json_object",
    code: "22037",
    class: DataExceptionErrorClass,
  },
  "22038": {
    name: "singleton_sql_json_item_required",
    code: "22038",
    class: DataExceptionErrorClass,
  },
  "22039": {
    name: "sql_json_array_not_found",
    code: "22039",
    class: DataExceptionErrorClass,
  },
  "2203A": {
    name: "sql_json_member_not_found",
    code: "2203A",
    class: DataExceptionErrorClass,
  },
  "2203B": {
    name: "sql_json_number_not_found",
    code: "2203B",
    class: DataExceptionErrorClass,
  },
  "2203C": {
    name: "sql_json_object_not_found",
    code: "2203C",
    class: DataExceptionErrorClass,
  },
  "2203D": {
    name: "too_many_json_array_elements",
    code: "2203D",
    class: DataExceptionErrorClass,
  },
  "2203E": {
    name: "too_many_json_object_members",
    code: "2203E",
    class: DataExceptionErrorClass,
  },
  "2203F": {
    name: "sql_json_scalar_required",
    code: "2203F",
    class: DataExceptionErrorClass,
  },
  "2203G": {
    name: "sql_json_item_cannot_be_cast_to_target_type",
    code: "2203G",
    class: DataExceptionErrorClass,
  },
  "23000": {
    name: "integrity_constraint_violation",
    code: "23000",
    class: IntegrityConstraintViolationErrorClass,
  },
  "23001": {
    name: "restrict_violation",
    code: "23001",
    class: IntegrityConstraintViolationErrorClass,
  },
  "23502": {
    name: "not_null_violation",
    code: "23502",
    class: IntegrityConstraintViolationErrorClass,
  },
  "23503": {
    name: "foreign_key_violation",
    code: "23503",
    class: IntegrityConstraintViolationErrorClass,
  },
  "23505": {
    name: "unique_violation",
    code: "23505",
    class: IntegrityConstraintViolationErrorClass,
  },
  "23514": {
    name: "check_violation",
    code: "23514",
    class: IntegrityConstraintViolationErrorClass,
  },
  "23P01": {
    name: "exclusion_violation",
    code: "23P01",
    class: IntegrityConstraintViolationErrorClass,
  },
  "24000": {
    name: "invalid_cursor_state",
    code: "24000",
    class: InvalidCursorStateErrorClass,
  },
  "25000": {
    name: "invalid_transaction_state",
    code: "25000",
    class: InvalidTransactionStateErrorClass,
  },
  "25001": {
    name: "active_sql_transaction",
    code: "25001",
    class: InvalidTransactionStateErrorClass,
  },
  "25002": {
    name: "branch_transaction_already_active",
    code: "25002",
    class: InvalidTransactionStateErrorClass,
  },
  "25008": {
    name: "held_cursor_requires_same_isolation_level",
    code: "25008",
    class: InvalidTransactionStateErrorClass,
  },
  "25003": {
    name: "inappropriate_access_mode_for_branch_transaction",
    code: "25003",
    class: InvalidTransactionStateErrorClass,
  },
  "25004": {
    name: "inappropriate_isolation_level_for_branch_transaction",
    code: "25004",
    class: InvalidTransactionStateErrorClass,
  },
  "25005": {
    name: "no_active_sql_transaction_for_branch_transaction",
    code: "25005",
    class: InvalidTransactionStateErrorClass,
  },
  "25006": {
    name: "read_only_sql_transaction",
    code: "25006",
    class: InvalidTransactionStateErrorClass,
  },
  "25007": {
    name: "schema_and_data_statement_mixing_not_supported",
    code: "25007",
    class: InvalidTransactionStateErrorClass,
  },
  "25P01": {
    name: "no_active_sql_transaction",
    code: "25P01",
    class: InvalidTransactionStateErrorClass,
  },
  "25P02": {
    name: "in_failed_sql_transaction",
    code: "25P02",
    class: InvalidTransactionStateErrorClass,
  },
  "25P03": {
    name: "idle_in_transaction_session_timeout",
    code: "25P03",
    class: InvalidTransactionStateErrorClass,
  },
  "25P04": {
    name: "transaction_timeout",
    code: "25P04",
    class: InvalidTransactionStateErrorClass,
  },
  "26000": {
    name: "invalid_sql_statement_name",
    code: "26000",
    class: InvalidSQLStatementNameErrorClass,
  },
  "27000": {
    name: "triggered_data_change_violation",
    code: "27000",
    class: TriggeredDataChangeViolationErrorClass,
  },
  "28000": {
    name: "invalid_authorization_specification",
    code: "28000",
    class: InvalidAuthorizationSpecificationErrorClass,
  },
  "28P01": {
    name: "invalid_password",
    code: "28P01",
    class: InvalidAuthorizationSpecificationErrorClass,
  },
  "2B000": {
    name: "dependent_privilege_descriptors_still_exist",
    code: "2B000",
    class: DependentPrivilegeDescriptorsStillExistErrorClass,
  },
  "2BP01": {
    name: "dependent_objects_still_exist",
    code: "2BP01",
    class: DependentPrivilegeDescriptorsStillExistErrorClass,
  },
  "2D000": {
    name: "invalid_transaction_termination",
    code: "2D000",
    class: InvalidTransactionTerminationErrorClass,
  },
  "2F000": {
    name: "sql_routine_exception",
    code: "2F000",
    class: SQLRoutineExceptionErrorClass,
  },
  "2F005": {
    name: "function_executed_no_return_statement",
    code: "2F005",
    class: SQLRoutineExceptionErrorClass,
  },
  "2F002": {
    name: "modifying_sql_data_not_permitted",
    code: "2F002",
    class: SQLRoutineExceptionErrorClass,
  },
  "2F003": {
    name: "prohibited_sql_statement_attempted",
    code: "2F003",
    class: SQLRoutineExceptionErrorClass,
  },
  "2F004": {
    name: "reading_sql_data_not_permitted",
    code: "2F004",
    class: SQLRoutineExceptionErrorClass,
  },
  "34000": {
    name: "invalid_cursor_name",
    code: "34000",
    class: InvalidCursorNameErrorClass,
  },
  "38000": {
    name: "external_routine_exception",
    code: "38000",
    class: ExternalRoutineExceptionErrorClass,
  },
  "38001": {
    name: "containing_sql_not_permitted",
    code: "38001",
    class: ExternalRoutineExceptionErrorClass,
  },
  "38002": {
    name: "modifying_sql_data_not_permitted",
    code: "38002",
    class: ExternalRoutineExceptionErrorClass,
  },
  "38003": {
    name: "prohibited_sql_statement_attempted",
    code: "38003",
    class: ExternalRoutineExceptionErrorClass,
  },
  "38004": {
    name: "reading_sql_data_not_permitted",
    code: "38004",
    class: ExternalRoutineExceptionErrorClass,
  },
  "39000": {
    name: "external_routine_invocation_exception",
    code: "39000",
    class: ExternalRoutineInvocationExceptionErrorClass,
  },
  "39001": {
    name: "invalid_sqlstate_returned",
    code: "39001",
    class: ExternalRoutineInvocationExceptionErrorClass,
  },
  "39004": {
    name: "null_value_not_allowed",
    code: "39004",
    class: ExternalRoutineInvocationExceptionErrorClass,
  },
  "39P01": {
    name: "trigger_protocol_violated",
    code: "39P01",
    class: ExternalRoutineInvocationExceptionErrorClass,
  },
  "39P02": {
    name: "srf_protocol_violated",
    code: "39P02",
    class: ExternalRoutineInvocationExceptionErrorClass,
  },
  "39P03": {
    name: "event_trigger_protocol_violated",
    code: "39P03",
    class: ExternalRoutineInvocationExceptionErrorClass,
  },
  "3B000": {
    name: "savepoint_exception",
    code: "3B000",
    class: SavepointExceptionErrorClass,
  },
  "3B001": {
    name: "invalid_savepoint_specification",
    code: "3B001",
    class: SavepointExceptionErrorClass,
  },
  "3D000": {
    name: "invalid_catalog_name",
    code: "3D000",
    class: InvalidCatalogNameErrorClass,
  },
  "3F000": {
    name: "invalid_schema_name",
    code: "3F000",
    class: InvalidSchemaNameErrorClass,
  },
  "40000": {
    name: "transaction_rollback",
    code: "40000",
    class: TransactionRollbackErrorClass,
  },
  "40002": {
    name: "transaction_integrity_constraint_violation",
    code: "40002",
    class: TransactionRollbackErrorClass,
  },
  "40001": {
    name: "serialization_failure",
    code: "40001",
    class: TransactionRollbackErrorClass,
  },
  "40003": {
    name: "statement_completion_unknown",
    code: "40003",
    class: TransactionRollbackErrorClass,
  },
  "40P01": {
    name: "deadlock_detected",
    code: "40P01",
    class: TransactionRollbackErrorClass,
  },
  "42000": {
    name: "syntax_error_or_access_rule_violation",
    code: "42000",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42601": {
    name: "syntax_error",
    code: "42601",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42501": {
    name: "insufficient_privilege",
    code: "42501",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42846": {
    name: "cannot_coerce",
    code: "42846",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42803": {
    name: "grouping_error",
    code: "42803",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42P20": {
    name: "windowing_error",
    code: "42P20",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42P19": {
    name: "invalid_recursion",
    code: "42P19",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42830": {
    name: "invalid_foreign_key",
    code: "42830",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42602": {
    name: "invalid_name",
    code: "42602",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42622": {
    name: "name_too_long",
    code: "42622",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42939": {
    name: "reserved_name",
    code: "42939",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42804": {
    name: "datatype_mismatch",
    code: "42804",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42P18": {
    name: "indeterminate_datatype",
    code: "42P18",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42P21": {
    name: "collation_mismatch",
    code: "42P21",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42P22": {
    name: "indeterminate_collation",
    code: "42P22",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42809": {
    name: "wrong_object_type",
    code: "42809",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "428C9": {
    name: "generated_always",
    code: "428C9",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42703": {
    name: "undefined_column",
    code: "42703",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42883": {
    name: "undefined_function",
    code: "42883",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42P01": {
    name: "undefined_table",
    code: "42P01",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42P02": {
    name: "undefined_parameter",
    code: "42P02",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42704": {
    name: "undefined_object",
    code: "42704",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42701": {
    name: "duplicate_column",
    code: "42701",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42P03": {
    name: "duplicate_cursor",
    code: "42P03",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42P04": {
    name: "duplicate_database",
    code: "42P04",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42723": {
    name: "duplicate_function",
    code: "42723",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42P05": {
    name: "duplicate_prepared_statement",
    code: "42P05",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42P06": {
    name: "duplicate_schema",
    code: "42P06",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42P07": {
    name: "duplicate_table",
    code: "42P07",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42712": {
    name: "duplicate_alias",
    code: "42712",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42710": {
    name: "duplicate_object",
    code: "42710",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42702": {
    name: "ambiguous_column",
    code: "42702",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42725": {
    name: "ambiguous_function",
    code: "42725",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42P08": {
    name: "ambiguous_parameter",
    code: "42P08",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42P09": {
    name: "ambiguous_alias",
    code: "42P09",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42P10": {
    name: "invalid_column_reference",
    code: "42P10",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42611": {
    name: "invalid_column_definition",
    code: "42611",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42P11": {
    name: "invalid_cursor_definition",
    code: "42P11",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42P12": {
    name: "invalid_database_definition",
    code: "42P12",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42P13": {
    name: "invalid_function_definition",
    code: "42P13",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42P14": {
    name: "invalid_prepared_statement_definition",
    code: "42P14",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42P15": {
    name: "invalid_schema_definition",
    code: "42P15",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42P16": {
    name: "invalid_table_definition",
    code: "42P16",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "42P17": {
    name: "invalid_object_definition",
    code: "42P17",
    class: SyntaxErrorOrAccessRuleViolationErrorClass,
  },
  "44000": {
    name: "with_check_option_violation",
    code: "44000",
    class: WITHCHECKOPTIONViolationErrorClass,
  },
  "53000": {
    name: "insufficient_resources",
    code: "53000",
    class: InsufficientResourcesErrorClass,
  },
  "53100": {
    name: "disk_full",
    code: "53100",
    class: InsufficientResourcesErrorClass,
  },
  "53200": {
    name: "out_of_memory",
    code: "53200",
    class: InsufficientResourcesErrorClass,
  },
  "53300": {
    name: "too_many_connections",
    code: "53300",
    class: InsufficientResourcesErrorClass,
  },
  "53400": {
    name: "configuration_limit_exceeded",
    code: "53400",
    class: InsufficientResourcesErrorClass,
  },
  "54000": {
    name: "program_limit_exceeded",
    code: "54000",
    class: ProgramLimitExceededErrorClass,
  },
  "54001": {
    name: "statement_too_complex",
    code: "54001",
    class: ProgramLimitExceededErrorClass,
  },
  "54011": {
    name: "too_many_columns",
    code: "54011",
    class: ProgramLimitExceededErrorClass,
  },
  "54023": {
    name: "too_many_arguments",
    code: "54023",
    class: ProgramLimitExceededErrorClass,
  },
  "55000": {
    name: "object_not_in_prerequisite_state",
    code: "55000",
    class: ObjectNotInPrerequisiteStateErrorClass,
  },
  "55006": {
    name: "object_in_use",
    code: "55006",
    class: ObjectNotInPrerequisiteStateErrorClass,
  },
  "55P02": {
    name: "cant_change_runtime_param",
    code: "55P02",
    class: ObjectNotInPrerequisiteStateErrorClass,
  },
  "55P03": {
    name: "lock_not_available",
    code: "55P03",
    class: ObjectNotInPrerequisiteStateErrorClass,
  },
  "55P04": {
    name: "unsafe_new_enum_value_usage",
    code: "55P04",
    class: ObjectNotInPrerequisiteStateErrorClass,
  },
  "57000": {
    name: "operator_intervention",
    code: "57000",
    class: OperatorInterventionErrorClass,
  },
  "57014": {
    name: "query_canceled",
    code: "57014",
    class: OperatorInterventionErrorClass,
  },
  "57P01": {
    name: "admin_shutdown",
    code: "57P01",
    class: OperatorInterventionErrorClass,
  },
  "57P02": {
    name: "crash_shutdown",
    code: "57P02",
    class: OperatorInterventionErrorClass,
  },
  "57P03": {
    name: "cannot_connect_now",
    code: "57P03",
    class: OperatorInterventionErrorClass,
  },
  "57P04": {
    name: "database_dropped",
    code: "57P04",
    class: OperatorInterventionErrorClass,
  },
  "57P05": {
    name: "idle_session_timeout",
    code: "57P05",
    class: OperatorInterventionErrorClass,
  },
  "58000": {
    name: "system_error",
    code: "58000",
    class: SystemErrorErrorClass,
  },
  "58030": {
    name: "io_error",
    code: "58030",
    class: SystemErrorErrorClass,
  },
  "58P01": {
    name: "undefined_file",
    code: "58P01",
    class: SystemErrorErrorClass,
  },
  "58P02": {
    name: "duplicate_file",
    code: "58P02",
    class: SystemErrorErrorClass,
  },
  "F0000": {
    name: "config_file_error",
    code: "F0000",
    class: ConfigurationFileErrorErrorClass,
  },
  "F0001": {
    name: "lock_file_exists",
    code: "F0001",
    class: ConfigurationFileErrorErrorClass,
  },
  "HV000": {
    name: "fdw_error",
    code: "HV000",
    class: ForeignDataWrapperErrorSQLMEDErrorClass,
  },
  "HV005": {
    name: "fdw_column_name_not_found",
    code: "HV005",
    class: ForeignDataWrapperErrorSQLMEDErrorClass,
  },
  "HV002": {
    name: "fdw_dynamic_parameter_value_needed",
    code: "HV002",
    class: ForeignDataWrapperErrorSQLMEDErrorClass,
  },
  "HV010": {
    name: "fdw_function_sequence_error",
    code: "HV010",
    class: ForeignDataWrapperErrorSQLMEDErrorClass,
  },
  "HV021": {
    name: "fdw_inconsistent_descriptor_information",
    code: "HV021",
    class: ForeignDataWrapperErrorSQLMEDErrorClass,
  },
  "HV024": {
    name: "fdw_invalid_attribute_value",
    code: "HV024",
    class: ForeignDataWrapperErrorSQLMEDErrorClass,
  },
  "HV007": {
    name: "fdw_invalid_column_name",
    code: "HV007",
    class: ForeignDataWrapperErrorSQLMEDErrorClass,
  },
  "HV008": {
    name: "fdw_invalid_column_number",
    code: "HV008",
    class: ForeignDataWrapperErrorSQLMEDErrorClass,
  },
  "HV004": {
    name: "fdw_invalid_data_type",
    code: "HV004",
    class: ForeignDataWrapperErrorSQLMEDErrorClass,
  },
  "HV006": {
    name: "fdw_invalid_data_type_descriptors",
    code: "HV006",
    class: ForeignDataWrapperErrorSQLMEDErrorClass,
  },
  "HV091": {
    name: "fdw_invalid_descriptor_field_identifier",
    code: "HV091",
    class: ForeignDataWrapperErrorSQLMEDErrorClass,
  },
  "HV00B": {
    name: "fdw_invalid_handle",
    code: "HV00B",
    class: ForeignDataWrapperErrorSQLMEDErrorClass,
  },
  "HV00C": {
    name: "fdw_invalid_option_index",
    code: "HV00C",
    class: ForeignDataWrapperErrorSQLMEDErrorClass,
  },
  "HV00D": {
    name: "fdw_invalid_option_name",
    code: "HV00D",
    class: ForeignDataWrapperErrorSQLMEDErrorClass,
  },
  "HV090": {
    name: "fdw_invalid_string_length_or_buffer_length",
    code: "HV090",
    class: ForeignDataWrapperErrorSQLMEDErrorClass,
  },
  "HV00A": {
    name: "fdw_invalid_string_format",
    code: "HV00A",
    class: ForeignDataWrapperErrorSQLMEDErrorClass,
  },
  "HV009": {
    name: "fdw_invalid_use_of_null_pointer",
    code: "HV009",
    class: ForeignDataWrapperErrorSQLMEDErrorClass,
  },
  "HV014": {
    name: "fdw_too_many_handles",
    code: "HV014",
    class: ForeignDataWrapperErrorSQLMEDErrorClass,
  },
  "HV001": {
    name: "fdw_out_of_memory",
    code: "HV001",
    class: ForeignDataWrapperErrorSQLMEDErrorClass,
  },
  "HV00P": {
    name: "fdw_no_schemas",
    code: "HV00P",
    class: ForeignDataWrapperErrorSQLMEDErrorClass,
  },
  "HV00J": {
    name: "fdw_option_name_not_found",
    code: "HV00J",
    class: ForeignDataWrapperErrorSQLMEDErrorClass,
  },
  "HV00K": {
    name: "fdw_reply_handle",
    code: "HV00K",
    class: ForeignDataWrapperErrorSQLMEDErrorClass,
  },
  "HV00Q": {
    name: "fdw_schema_not_found",
    code: "HV00Q",
    class: ForeignDataWrapperErrorSQLMEDErrorClass,
  },
  "HV00R": {
    name: "fdw_table_not_found",
    code: "HV00R",
    class: ForeignDataWrapperErrorSQLMEDErrorClass,
  },
  "HV00L": {
    name: "fdw_unable_to_create_execution",
    code: "HV00L",
    class: ForeignDataWrapperErrorSQLMEDErrorClass,
  },
  "HV00M": {
    name: "fdw_unable_to_create_reply",
    code: "HV00M",
    class: ForeignDataWrapperErrorSQLMEDErrorClass,
  },
  "HV00N": {
    name: "fdw_unable_to_establish_connection",
    code: "HV00N",
    class: ForeignDataWrapperErrorSQLMEDErrorClass,
  },
  "P0000": {
    name: "plpgsql_error",
    code: "P0000",
    class: PLpgSQLErrorErrorClass,
  },
  "P0001": {
    name: "raise_exception",
    code: "P0001",
    class: PLpgSQLErrorErrorClass,
  },
  "P0002": {
    name: "no_data_found",
    code: "P0002",
    class: PLpgSQLErrorErrorClass,
  },
  "P0003": {
    name: "too_many_rows",
    code: "P0003",
    class: PLpgSQLErrorErrorClass,
  },
  "P0004": {
    name: "assert_failure",
    code: "P0004",
    class: PLpgSQLErrorErrorClass,
  },
  "XX000": {
    name: "internal_error",
    code: "XX000",
    class: InternalErrorErrorClass,
  },
  "XX001": {
    name: "data_corrupted",
    code: "XX001",
    class: InternalErrorErrorClass,
  },
  "XX002": {
    name: "index_corrupted",
    code: "XX002",
    class: InternalErrorErrorClass,
  },
} as const satisfies Record<string, PostgresErrorCode>;
