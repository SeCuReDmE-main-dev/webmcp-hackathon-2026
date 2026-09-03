namespace Qcg {
  @EntryPoint()
  operation Main() : Result[] {
    use (left, right) = (Qubit(), Qubit());
    H(left);
    CNOT(left, right);
    let result = [M(left), M(right)];
    ResetAll([left, right]);
    return result;
  }
}