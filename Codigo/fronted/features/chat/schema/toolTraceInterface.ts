export interface ToolTrace {
  tool_name: string;
  input_data: unknown;
  output_data: unknown;
  timestamp: string;
}

export interface ToolTraceResponse {
  tool_trace: ToolTrace[];
  length: number;
}
